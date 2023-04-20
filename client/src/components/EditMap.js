import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Typography, Toolbar, Box, AppBar } from "@mui/material";
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

/*
    This React component lets us edit the properties of a map, which only
    happens when we are on the proper route.
    
*/

export default function EditMap() {
  let navigate = useNavigate();

  const { store } = useContext(GlobalStoreContext);
  const [map, setMap] = useState("");

  useEffect(() => {
    console.log("created map");
    let newmap = L.map('my-map', { editable: true, }).setView([0, 0], 3);
    console.log(newmap);
    newmap.editTools.featuresLayer.addTo(newmap);
    newmap.on('editable:vertex:dragend', handleFeatureEdit);
    newmap.on('editable:deleted', handleFeatureAdd);
    newmap.on('editable:drawing:end', handleFeatureAdd);
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
    setMap(newmap);
    return () => {
      // Remove the map
      newmap.remove();
    };
  }, []);

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
    layer.bindTooltip(regionName, { permanent: true, direction: "center", fillColor: "blue" });
    layer.on("dblclick", function () {
      console.log("double")
      var content = document.createElement("textarea");
      content.addEventListener("keyup", function (e) {
        console.log("uppppp" + e.key)
        if (e.key == "Enter") {
          layer.bindPopup(content.value);
          regionName = content.value;
          layer.setTooltipContent(regionName);
        }
        // country.properties.admin = content.value
      })
      layer.bindPopup(content).openPopup();
    })
    layer.on("click", function () {
      if (layer.editEnabled()) {
        layer.disableEdit();
      }
      else {
        layer.enableEdit();
      }
      if (layer.selected == true) {
        //deSelect(layer);
      }
      else {
        //selectRegion(layer);
      }
    })
  }

  const handleFeatureEdit = (e) => {
    const feature = e.layer.toGeoJSON();
    console.log(feature);
    //setTransaction([...transaction, { type: 'edit', feature }]);
  };

  const handleFeatureAdd = (e) => {
    const feature = e.layer.toGeoJSON();
    console.log("yes", feature);
    store.addPolygonToMap(feature);
    //setTransaction([...transaction, { type: 'delete', feature }]);
  };

  const handleStartPolyline = (e) => {
    if (map.editTools) {
      map.editTools.startPolygon();
    }
  }

  return (
    <div>
      <div id="create-map-screen">
        <IconButton
          aria-label="back"
          onClick={(event) => {
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
                onClick = {handleStartPolyline}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
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