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

/*
    This React component lets us edit the properties of a map, which only
    happens when we are on the proper route.
    
*/

export let selectedRegions = [];

export default function EditMap() {
  let navigate = useNavigate();

  const { store } = useContext(GlobalStoreContext);
  const [map, setMap] = useState("");
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [vertexButtonEnabled, setVertexbuttonEnabled] = useState(true);
  const [addButtonEnabled, setAddButtonEnabled] = useState(false);
  const [renameButtonEnabled, setRenameButtonEnabled] = useState(false);


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

  function selectRegion(layer) {
    layer.setStyle({
      color: 'yellow'
    });
    layer.selected = true;
    selectedRegions.push(layer);
    setRenameButtonEnabled(true)
    //console.log(selectedRegions.toString())
  }
  function deSelect(layer) {
    layer.setStyle({
      color: '#3388FF'
    });
    layer.selected = false;
    const index = selectedRegions.indexOf(layer);
    selectedRegions.splice(index, 1);
    setRenameButtonEnabled(false)
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
        setSelectedLayer(null);
        setSelectedCountry(null);
      }
      else {
        layer.enableEdit();
        setSelectedLayer(layer);
        setSelectedCountry(country);
      }
      if (layer.selected == true) {
        deSelect(layer);
        setSelectedLayer(null);
        setSelectedCountry(null);
      }
      else {
        selectRegion(layer);
        setSelectedLayer(layer);
        setSelectedCountry(country);
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


  const handleEditSubregionName = (e) => {
    let regionName = "";
    if (selectedLayer) {
      // Bind the tooltip to the layer and set its content
      selectedLayer.bindTooltip(regionName, { permanent: true, direction: "center", fillColor: "blue" });
      // Set up the click event listener on the layer
      var content = document.createElement("textarea");
      content.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        selectedLayer.bindPopup(content.value);
        regionName= content.value;
        selectedLayer.setTooltipContent(content.value);
        }
      });
      selectedLayer.bindPopup(content).openPopup();

    }
  }

  const handleVertexButton = () => {
    setAddButtonEnabled(true);
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

              <Tooltip title="Undo">
                <IconButton 
                  disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <UndoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Redo">
                <IconButton
                  disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <RedoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Rename">
                <IconButton
                  disabled={!renameButtonEnabled}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  // onClick={this.handleEditSubregionName.bind(this,layer)}
                  onClick={handleEditSubregionName}
                >
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Change Color">
                <IconButton
                  disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <FormatColorFillIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Vertex">
                <IconButton
                  disabled={!vertexButtonEnabled}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleVertexButton}
                >
                  <CircleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Subregion">
                <IconButton
                  disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <SouthAmericaIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Vertices/Subregions">
                <IconButton
                  disabled={!addButtonEnabled}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleStartPolyline}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Vertices/Subregions">
                <IconButton
                  disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Merge Subregions">
                <IconButton
                  disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MergeIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Split Subregions">
                <IconButton
                  disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <CallSplitIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Info">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
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