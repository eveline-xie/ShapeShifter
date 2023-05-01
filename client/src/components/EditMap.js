import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Typography, Toolbar, Box, AppBar, Tooltip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import AddIcon from "@mui/icons-material/Add";
import CompressIcon from '@mui/icons-material/Compress';
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
import * as turf from 'turf';


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
  let changedColor = '';
  let regionsToMerge = [];
  let mergeEnabled = false;
  let splitEnabled = false;

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
    // console.log("1:" + layer.color);
    if (layer.color == undefined) {
      // console.log("2:" + layer.color);
      layer.setStyle({
        color: 'yellow'
      });
      layer.selected = true;
      selectedRegions.push(layer);
      //setRenameButtonEnabled(true)
      //console.log(selectedRegions.toString())
    } else {
      // console.log("3:" + layer.color);
      layer.setStyle({
        color: layer.color
      });
      layer.selected = true;
      selectedRegions.push(layer);
      //setRenameButtonEnabled(true)
      //console.log(selectedRegions.toString())
    }
  }
  function deSelect(layer) {
    // console.log("1:" + layer.color);
    if (layer.color == undefined) {
      // console.log("2:" + layer.color);
      layer.setStyle({
        color: '#3388FF'
      });
      layer.selected = false;
      const index = selectedRegions.indexOf(layer);
      selectedRegions.splice(index, 1);
      //setRenameButtonEnabled(false)
      //console.log(selectedRegions.toString())
    } else {
      // console.log("3:" + layer.color);
      layer.setStyle({
        color: layer.color
      });
      layer.selected = false;
      const index = selectedRegions.indexOf(layer);
      selectedRegions.splice(index, 1);
      //setRenameButtonEnabled(false)
      //console.log(selectedRegions.toString())
    }
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
      if (mergeEnabled) {
        layer.setStyle({
          color: 'red'
        });
        if (regionsToMerge.indexOf(layer) == -1) {
          regionsToMerge.push(layer);
        }
        if (regionsToMerge.length == 2) {
          console.log(regionsToMerge[0].feature);
          console.log(regionsToMerge[1].feature);
          let merged = turf.union(regionsToMerge[0].feature, regionsToMerge[1].feature);
          map.removeLayer(regionsToMerge[0]);
          map.removeLayer(regionsToMerge[1]);
          console.log(store.currentMap.geoJsonMap);
          //store.currentMap.geoJsonMap.push(merged);
          L.geoJSON(merged, {onEachFeature: onEachRegion}).addTo(map);
          store.mergePolygonsOfMap([regionsToMerge[0].feature, regionsToMerge[1].feature], merged);
          handleEnableMerge();
        }
      }
      else {
        if (layer.editEnabled()) {
          layer.disableEdit();
          //setDeleteButtonEnabled(false);
  
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
          //setDeleteButtonEnabled(true);
        }
      }
    })
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
          regionName = content.value;
          selectedLayer.setTooltipContent(content.value);
        }
      });
      selectedLayer.bindPopup(content).openPopup();

    }
  }

  const handleChangeColor = (e) => {
    console.log("changeColor");
    if (selectedLayer) {
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.id = 'colorpicker';

      colorPicker.addEventListener("change", function () {

        changedColor = colorPicker.value;
        console.log("Selected color:", changedColor);

        selectedLayer.color = changedColor;
        selectedLayer.setStyle({
          color: changedColor
        });
      });
      document.body.appendChild(colorPicker);
      colorPicker.click();
    }
  }

  const handleStartPolygon = (e) => {
    if (map.editTools) {
      let polygon = map.editTools.startPolygon();
    }
  }

  const handleFeatureAdd = (e) => {
    console.log(e);

    const feature = e.layer.toGeoJSON();
    onEachRegion(feature, e.layer);

    console.log("adding", feature);
    store.addPolygonToMap(feature);

    prevLayer = selectedLayer;
    prevPolygon = selectedPolygon;
    if (selectedLayer) {
      selectedLayer.disableEdit();
      deSelect(selectedLayer);
    }
    selectedLayer = e.layer;
    selectRegion(selectedLayer);
    selectedPolygon = feature;
    //setTransaction([...transaction, { type: 'delete', feature }]);
  };

  const handleFeatureDelete = (e) => {
    if (selectedLayer !== null) {
      store.deletePolygonOfMap(selectedPolygon);

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
    store.updatePolygonOfMap(prevPolygon, feature);
  }

  const handleFeatureDeleteVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    prevPolygon = selectedPolygon;
    selectedPolygon = feature;
    store.updatePolygonOfMap(prevPolygon, feature);
  }

  const handleCompressMap = (e) => {
    console.log("current map: ")
    console.log(store.currentMap.geoJsonMap)
    const feature = turf.feature(store.currentMap.geoJsonMap);
    console.log(feature)

    console.log("leaflet map: ")
    console.log(map)
    //console.log(feature)
    // Simplify the feature using the Turf simplify() function
    const simplified = turf.simplify(feature, 0.01);
    console.log(simplified)
    const simplifiedFeature = turf.featureCollection(simplified).features.geometry.geometry;
    console.log(simplifiedFeature)
    //L.geoJSON().clearLayers();

    // map.removeLayer(L.geoJSON(store.currentMap.geoJsonMap));
    /*map.eachLayer(function (layer) {
      if (layer instanceof L.GeoJSON) {
        layer.remove();
      }
    });
    */

    var simplifiedGeojsonMapLayer = L.geoJson(simplifiedFeature, {
      onEachFeature: onEachRegion
    });
    simplifiedGeojsonMapLayer.eachLayer(function (layer) {
      layer.addTo(map);
    });

    store.currentMap.geoJsonMap = simplifiedFeature;
    console.log("current map: ")
    console.log(store.currentMap.geoJsonMap)
  }

  const handleInfo = (e) => {
    // var text = document.getElementById("infoText");
    // if (text.style.display == "none") {
    //   text.style.display = "block";
    // } else {
    //   text.style.display = "none";
    // }
  }

  const handleEnableMerge = () => {
    mergeEnabled = !mergeEnabled;
    console.log(mergeEnabled);
    //console.log(regionsToMerge.length);
    if (!mergeEnabled) {
      console.log(regionsToMerge.length);
      for (let i = 0; i < regionsToMerge.length; i++) {
        regionsToMerge[i].setStyle({
          color: '#3388FF'
        });
      }
      regionsToMerge = [];
    }
  }

  const handleEnableSplit = () => {
    if (selectedLayer) {
      console.log("Ff");
    }
  }

  return (
    <div>
      <div id="create-map-screen">
        <IconButton
          aria-label="back"
          onClick={(event) => {
            store.updateThumbnailOfMap(store.currentMap._id);
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
                  //disabled={!renameButtonEnabled}
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
                  // disabled
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleChangeColor}
                >
                  <FormatColorFillIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Subregion">
                <IconButton
                  //disabled={!addButtonEnabled}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleStartPolygon}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Subregion">
                <IconButton
                  //disabled = {!deleteButtonEnabled}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleFeatureDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Merge Subregions">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick = {handleEnableMerge}
                >
                  <MergeIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Split Subregions">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick = {handleEnableSplit}
                >
                  <CallSplitIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Compress Map">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleCompressMap}
                >
                  <CompressIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Info">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleInfo}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>

            </Toolbar>
          </AppBar>
        </Box>
      </div>
      {/* <div id="infoText" padding-left='100px' style={{ color: 'white' }} >
        <p>Rename Button: Select a subregion and name or modify the subregion's name</p>
        <p>Change Color Button: Select a subregion and fill or modify the subregion's highlighted color</p>
        <p>Add Subregion Button: </p>
        <p>Delete Subregion Button: </p>
        <p>Merge Subregion Button: </p>
        <p>Split Subregion Button: </p>
        <p>Compress Subregion Button: </p>
      </div> */}
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