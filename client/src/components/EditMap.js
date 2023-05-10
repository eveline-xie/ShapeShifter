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

  const [undoButtonEnabled, setUndoButtonEnabled] = useState(true);
  const [redoButtonEnabled, setRedoButtonEnabled] = useState(true);
  const [renameButtonEnabled, setRenameButtonEnabled] = useState(false);
  const [colorButtonEnabled, setColorButtonEnabled] = useState(false);
  const [addButtonEnabled, setAddButtonEnabled] = useState(true);
  const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);
  const [mergeButtonEnabled, setMergeButtonEnabled] = useState(true);
  const [splitButtonEnabled, setSplitButtonEnabled] = useState(false);



  const [currentView, setCurrentView] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(null);

  const [currentPolygon, setCurrentPolygon] = useState(null);

  // const [prevPolygon, setPrevPolygon] = useState(null);
  // const [selectedPolygon, setSelectedPolygon] = useState(null);
  // const [prevLayer, setPrevLayer] = useState(null);
  // const [selectedLayer, setSelectedLayer] = useState(null);


  let map = null;
  const [aMap, setAMap] = useState(null);
  if (map == null) {
    map = aMap;
  }
  let prevPolygon = null;
  let selectedPolygon = null;
  let prevLayer = null;
  let selectedLayer = null;
  let changedColor = '';
  let regionsToMerge = [];

  const [mergeEnabled, setMergeEnabled] = useState(false);
  let splitEnabled = false;

  useEffect(() => {
    console.log("reloading map");
    var newmap;
    if (currentView) {
      newmap = L.map('my-map', { editable: true, }).setView(currentView, currentZoom);
    }
    else {
      newmap = L.map('my-map', { editable: true, }).setView([0, 0], 3);
    }
    newmap.editTools.featuresLayer.addTo(newmap);
    newmap.on('editable:drawing:end', handleFeatureAdd);
    //newmap.on('editable:vertex:dragstart', handleFeatureStartMoveVertex);
    newmap.on('editable:vertex:dragend', handleFeatureEndMoveVertex);
    //newmap.on('editable:vertex:new', handleFeatureAddVertex);
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
      layer.addTo(newmap);
    })
    map = newmap;
    setAMap(newmap);
    return () => {
      // Remove the map
      newmap.remove();
      if (window.location.href !== "http://localhost:3000/editmap") {
        store.clearAllTransactions();
      }
    };
  }, [store.currentMap.geoJsonMap, mergeEnabled]);

  function selectRegion(layer) {
    if (layer.color == undefined) {
      layer.setStyle({
        color: 'yellow'
      });
      layer.selected = true;
      selectedRegions.push(layer);
      //setRenameButtonEnabled(true)
    } else {
      layer.setStyle({
        color: layer.color
      });
      layer.selected = true;
      selectedRegions.push(layer);
      //setRenameButtonEnabled(true)
    }
  }
  function deSelect(layer) {
    if (layer.color == undefined) {
      // console.log("2:" + layer.color);
      layer.setStyle({
        color: '#3388FF'
      });
      layer.selected = false;
      const index = selectedRegions.indexOf(layer);
      selectedRegions.splice(index, 1);
      //setRenameButtonEnabled(false)
    } else {
      layer.setStyle({
        color: layer.color
      });
      layer.selected = false;
      const index = selectedRegions.indexOf(layer);
      selectedRegions.splice(index, 1);
      //setRenameButtonEnabled(false)
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
          let merged = turf.union(regionsToMerge[0].feature, regionsToMerge[1].feature);
          map.removeLayer(regionsToMerge[0]);
          map.removeLayer(regionsToMerge[1]);
          L.geoJSON(merged, { onEachFeature: onEachRegion }).addTo(map);
          setCurrentView(map.getCenter());
          setCurrentZoom(map.getZoom());
          store.addmergePolygonsOfMapTransaction([regionsToMerge[0].feature, regionsToMerge[1].feature], merged);
          handleEnableMerge();
        }
      }
      else {
        if (layer.editEnabled()) {
          setRenameButtonEnabled(false);
          setColorButtonEnabled(false);
          setDeleteButtonEnabled(false);
          setSplitButtonEnabled(false);

          setAddButtonEnabled(true);
          setMergeButtonEnabled(true);

          layer.disableEdit();
          //setDeleteButtonEnabled(false);

          deSelect(layer);
          selectedPolygon = null;
          selectedLayer = null;
        }
        else {
          setRenameButtonEnabled(true);
          setColorButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setSplitButtonEnabled(true);

          setAddButtonEnabled(false);
          setMergeButtonEnabled(false);

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
          console.log("current polygon:", layer.toGeoJSON());
          //setDeleteButtonEnabled(true);

          setCurrentPolygon(layer.toGeoJSON());
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
    setAddButtonEnabled(false);
    if (map.editTools) {
      let polygon = map.editTools.startPolygon();
    }
  }

  const handleFeatureAdd = (e) => {
    setAddButtonEnabled(true);

    const feature = e.layer.toGeoJSON();
    onEachRegion(feature, e.layer);

    console.log("adding", feature);

    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
    store.addAddPolygonToMapTransaction(feature);

    prevLayer = selectedLayer;
    prevPolygon = selectedPolygon;
    if (selectedLayer) {
      selectedLayer.disableEdit();
      deSelect(selectedLayer);
    }
    selectRegion(e.layer);

    selectedLayer = e.layer;
    selectedPolygon = feature;
    //setTransaction([...transaction, { type: 'delete', feature }]);
  };

  const handleFeatureDelete = (e) => {
    console.log(selectedLayer);
    console.log("curr poly", currentPolygon);
    if (currentPolygon !== null) {
      setCurrentView(map.getCenter());
      setCurrentZoom(map.getZoom());
      store.addDeletePolygonOfMapTransaction(currentPolygon);

      prevPolygon = null;
      prevLayer = null;
      selectedPolygon = null;
      selectedLayer = null;
      setCurrentPolygon(null);

      setRenameButtonEnabled(false);
      setColorButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setSplitButtonEnabled(false);

      setAddButtonEnabled(true);
      setMergeButtonEnabled(true);

    }
  }

  // const handleFeatureStartMoveVertex = (e) => {
  //   const feature = e.layer.toGeoJSON();
  //   prevPolygon = selectedPolygon;
  //   selectedPolygon = feature;

  //   //setTransaction([...transaction, { type: 'edit', feature }]);
  // };

  const handleFeatureEndMoveVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    console.log("prev", selectedPolygon);
    console.log("updated", feature);
    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
    store.addUpdatePolygonToMapTransaction(selectedPolygon, feature);

    prevPolygon = null;
    selectedPolygon = feature;

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    //setTransaction([...transaction, { type: 'edit', feature }]);
  };

  // const handleFeatureAddVertex = (e) => {
  //   if (newPolygon !== true) {
  //     const feature = e.layer.toGeoJSON();
  //     prevPolygon = selectedPolygon;
  //     selectedPolygon = feature;
  //     setCurrentView(map.getCenter());
  //     setCurrentZoom(map.getZoom());
  //     store.updatePolygonOfMap(prevPolygon, feature);
  //   }
  // }

  const handleFeatureDeleteVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    console.log("prev", selectedPolygon);
    console.log("updated", feature);

    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
    store.addUpdatePolygonToMapTransaction(selectedPolygon, feature);

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);

    prevPolygon = selectedPolygon;
    selectedPolygon = feature;

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
    console.log("merge enabled:", !mergeEnabled);
    if (mergeEnabled) {
      console.log(regionsToMerge.length);
      for (let i = 0; i < regionsToMerge.length; i++) {
        regionsToMerge[i].setStyle({
          color: '#3388FF'
        });
      }
      regionsToMerge = [];

      setRenameButtonEnabled(false);
      setColorButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setSplitButtonEnabled(false);

      setAddButtonEnabled(true);

      setUndoButtonEnabled(true);
      setRedoButtonEnabled(true);
    }
    else {
      setRenameButtonEnabled(false);
      setColorButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setSplitButtonEnabled(false);
      
      setAddButtonEnabled(false);

      setUndoButtonEnabled(false);
      setRedoButtonEnabled(false);
    }
    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
    setMergeEnabled(!mergeEnabled);


  }

  const handleEnableSplit = () => {
    if (selectedLayer) {
    }
  }

  function handleUndo() {
    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
    
    store.undo();

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
  }
  function handleRedo() {
    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
    store.redo();

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
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
                  disabled={(!store.canUndo() || !undoButtonEnabled)}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleUndo}
                >
                  <UndoIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Redo">
                <IconButton
                  disabled={(!store.canRedo() || !redoButtonEnabled)}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleRedo}
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
                  disabled={!colorButtonEnabled}
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
                  disabled={!addButtonEnabled}
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
                  disabled={!deleteButtonEnabled}
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
                  disabled={!mergeButtonEnabled}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleEnableMerge}
                >
                  <MergeIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Split Subregions">
                <IconButton
                  disabled={!splitButtonEnabled}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleEnableSplit}
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