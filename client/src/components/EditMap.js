import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Typography, Toolbar, Box, AppBar, Tooltip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import AddIcon from "@mui/icons-material/Add";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import MergeIcon from "@mui/icons-material/Merge";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CircleIcon from "@mui/icons-material/Circle";
import SouthAmericaIcon from "@mui/icons-material/SouthAmerica";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import GlobalStoreContext from "../store";
import { useContext, useEffect, useState } from 'react'
import L from 'leaflet';
import 'leaflet-editable'
import "leaflet/dist/leaflet.css";
import { feature } from "topojson-client";

/*
    This React component lets us edit the properties of a map, which only
    happens when we are on the proper route.
    
*/

export let selectedRegions = [];

export default function EditMap() {
  let navigate = useNavigate();

  const { store } = useContext(GlobalStoreContext);
  //const [selectedPolygon, setSelectedPolygon] = useState("");;
  var map;
  let prevPolygon = null;
  let selectedPolygon = null;
  let prevLayer = null;
  let selectedLayer = null;
  let featuresLength = store.currentMap.geoJsonMap.features.length;

  useEffect(() => {
    console.log("created map");
    let newmap = L.map('my-map', { editable: true, }).setView([0, 0], 3);
    console.log(newmap);
    newmap.editTools.featuresLayer.addTo(newmap);
    newmap.on('editable:drawing:end', handleFeatureAdd);
    newmap.on('editable:vertex:dragstart', handleFeatureStartMoveVertex);
    newmap.on('editable:vertex:dragend', handleFeatureEndMoveVertex);
    newmap.on('editable:vertex:new', handleFeatureAddVertex);
    newmap.on('editable:vertex:deleted', handleFeatureDeleteVertex);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(newmap);
    var geojsonMap =
      L.geoJson(store.currentMap.geoJsonMap, {
        onEachFeature: onEachRegion
      });
    geojsonMap.eachLayer(function (layer) {
      //console.log(layer);
      layer.addTo(newmap);
    })
    // window.createdMap.push(newmap);
    // console.log(window.createdMap[0]);
    // console.log(window.createdMap.length);
    map = newmap;
    //setMap(newmap);
    return () => {
      // Remove the map
      newmap.remove();
    };
  }, []);

  function selectRegion(layer) {
    layer.setStyle({
      color: 'yellow'
    });
    layer.selected = true;
    selectedRegions.push(layer);
    //setRenameButtonEnabled(true)
    //console.log(selectedRegions.toString())
  }
  function deSelect(layer) {
    layer.setStyle({
      color: '#3388FF'
    });
    layer.selected = false;
    const index = selectedRegions.indexOf(layer);
    selectedRegions.splice(index, 1);
    //setRenameButtonEnabled(false)
    //console.log(selectedRegions.toString())
  }

  function onEachRegion(country, layer) {
    // layer.bindPopup(country.properties.admin,{ autoClose: false, closeOnClick: false });
    let regionName = "";
    if (country.properties !== undefined) {
      if (country.properties.NAME_5) {
        regionName = country.properties.NAME_5;
      }
      else if (country.properties.NAME_4) {
        regionName = country.properties.NAME_4;
      }
      else if (country.properties.NAME_3) {
        regionName = country.properties.NAME_3;
      }
      else if (country.properties.NAME_2) {
        regionName = country.properties.NAME_2;
      }
      else if (country.properties.NAME_1) {
        regionName = country.properties.NAME_1;
      }
      else if (country.properties.NAME_0) {
        regionName = country.properties.NAME_0;
      }
    }

    layer.on("click", function () {
      if (layer.editEnabled()) {
        layer.disableEdit();
        deSelect(layer);
        selectedPolygon = null;
        selectedLayer = null;
      }
      else {
        layer.enableEdit();
        selectRegion(layer);
        prevPolygon = selectedPolygon;
        prevLayer = selectedLayer;
        if (prevPolygon !== null) {
          prevLayer.disableEdit();
          deSelect(prevLayer);
        }
        selectedPolygon = layer.toGeoJSON();
        selectedLayer = layer;
        console.log(selectedPolygon);
      }
    })
  }


  const handleStartPolygon = (e) => {
    if (map.editTools) {
      let polygon = map.editTools.startPolygon();
      polygon.options.properties = {
        myId: featuresLength
      }
    }
  }

  const handleFeatureAdd = (e) => {
    console.log(e);

    const feature = e.layer.toGeoJSON();
    feature.properties.myId = featuresLength++;
    onEachRegion(feature, e.layer);

    console.log("adding", feature);
    store.addPolygonToMap(feature);

    prevLayer = selectedLayer;
    prevPolygon = selectedPolygon;
    if (selectedLayer) {
      selectedLayer.disableEdit();
    }
    selectedLayer = e.layer;
    selectedPolygon = feature;
    //setTransaction([...transaction, { type: 'delete', feature }]);
  };

  const handleFeatureDelete = (e) => {
    if (selectedLayer !== null) {
      store.deletePolygonOfMap(selectedPolygon);

      featuresLength -= 1;
      map.removeLayer(selectedLayer);
      prevPolygon = null;
      prevLayer = null;
      selectedPolygon = null;
      selectedLayer = null;
    }
  }

  const handleFeatureStartMoveVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    prevPolygon = selectedPolygon;
    selectedPolygon = feature;
    //setTransaction([...transaction, { type: 'edit', feature }]);
  };

  const handleFeatureEndMoveVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    console.log("prev", prevPolygon);
    console.log("updated", feature);
    store.updatePolygonOfMap(prevPolygon, feature);
    prevPolygon = null;
    selectedPolygon = feature;
    //setTransaction([...transaction, { type: 'edit', feature }]);
  };

  const handleFeatureAddVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    prevPolygon = selectedPolygon;
    selectedPolygon = feature;
  }

  const handleFeatureDeleteVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    prevPolygon = selectedPolygon;
    selectedPolygon = feature;
    store.updatePolygonOfMap(prevPolygon, feature);
  }

  return (
    <div>
      <div id="create-map-screen">
        <IconButton
          aria-label="back"
          onClick={(event) => {
            store.loadMapById(store.currentMap._id);
            navigate("/createmap");
          }}
        >
          <ArrowBackIosIcon />
          Back
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <UndoIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <RedoIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <BorderColorIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <FormatColorFillIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <CircleIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <SouthAmericaIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick = {handleStartPolygon}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick = {handleFeatureDelete}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MergeIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <CallSplitIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <InfoIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      <div>
        {/* <Box
          component="img"
          sx={{
            height: 900,
            width: "100%",
            //   maxHeight: { xs: 233, md: 167 },
            //   maxWidth: { xs: 350, md: 250 },
          }}
          alt="Map Preview"
          src="map.png"
        /> */}
      </div>
      <div id="my-map" style={{ height: "80vh" }}></div>
    </div>
  );
}