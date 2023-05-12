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
import * as turf from '@turf/turf';


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
  const [currentLayer, setCurrentLayer] = useState(null);

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
  const [splitEnabled, setSplitEnabled] = useState(false);

  useEffect(() => {
    console.log("reloading map");

    var southWest = L.latLng(-500, -500);
    var northEast = L.latLng(500, 500);
    var bounds = L.latLngBounds(southWest, northEast);

    var newmap;
    newmap = L.map('my-map', { editable: true, maxBounds: bounds });
    var geojsonMap =
      L.geoJson(store.currentMap.geoJsonMap, {
        onEachFeature: onEachRegion
      });
    if (currentView) {
      newmap.setView(currentView, currentZoom);
    }
    else {
      var bounds = geojsonMap.getBounds();
      newmap.fitBounds(bounds);
    }

    newmap.editTools.featuresLayer.addTo(newmap);
    newmap.on('editable:drawing:end', handleFeatureAdd);
    //newmap.on('editable:vertex:dragstart', handleFeatureStartMoveVertex);
    newmap.on('editable:vertex:dragend', handleFeatureEndMoveVertex);
    newmap.on('editable:vertex:new', handleSplitFeature);
    newmap.on('editable:vertex:deleted', handleFeatureDeleteVertex);
    newmap.on('moveend', handleSetView);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 2
    }).addTo(newmap);

    geojsonMap.eachLayer(function (layer) {
      layer.addTo(newmap);
    })
    map = newmap;
    setAMap(newmap);

    return () => {
      // Remove the map
      newmap.remove();
      if (window.location.pathname !== "/editmap") {
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
  function deSelect(layer, color) {
    console.log(layer.color);
    if (color == null) {
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
        color: color
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
      else if (country.properties.admin) {
        regionName = country.properties.admin;
      }

      if (country.properties.color) {
        layer.setStyle({
          color: country.properties.color
        })
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
          if (country.properties !== undefined) {
            console.log("there are properties");
            if (country.properties.color) {
              deSelect(layer, country.properties.color);
            }
            else {
              deSelect(layer, null);
            }
          }
          else {
            deSelect(layer, null);
          }

          selectedPolygon = null;
          selectedLayer = null;
        }
        else {
          console.log("selecting region");
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
            if (prevPolygon.properties !== undefined) {
              if (prevPolygon.properties.color) {
                deSelect(prevLayer, prevPolygon.properties.color);
              }
              else {
                deSelect(prevLayer, null);
              }
            }
            else {
              deSelect(prevLayer, null);
            }
          }
          selectedPolygon = layer.toGeoJSON();
          selectedLayer = layer;
          console.log("current polygon:", layer.toGeoJSON());
          //setDeleteButtonEnabled(true);

          setCurrentPolygon(layer.toGeoJSON());
          setCurrentLayer(layer);
        }
      }
    })
  }

  const handleSetView = (e) => {
    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
  }

  const handleEditSubregionName = (e) => {
    let regionName = "";
    if (currentLayer) {
      // Bind the tooltip to the layer and set its content
      currentLayer.bindTooltip(regionName, { permanent: true, direction: "center", fillColor: "blue" });
      // Set up the click event listener on the layer
      var content = document.createElement("textarea");
      content.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
          currentLayer.bindPopup(content.value);
          regionName = content.value;
          currentLayer.setTooltipContent(content.value);
        }
      });
      currentLayer.bindPopup(content).openPopup();

    }
  }

  const handleChangeColor = (e) => {
    console.log("changeColor");
    if (currentLayer) {
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.id = 'colorpicker';

      colorPicker.addEventListener("change", function () {

        changedColor = colorPicker.value;
        console.log("Selected color:", changedColor);

        currentLayer.color = changedColor;
        currentLayer.setStyle({
          color: changedColor
        });
        let changedColorPolygon = JSON.parse(JSON.stringify(currentPolygon));

        changedColorPolygon.properties.color = changedColor;

        store.addUpdatePolygonToMapTransaction(currentPolygon, changedColorPolygon);
      });
      document.body.appendChild(colorPicker);
      colorPicker.click();
    }
  }

  const handleStartPolygon = (e) => {
    setAddButtonEnabled(false);
    setMergeButtonEnabled(false);
    if (map.editTools) {
      let polygon = map.editTools.startPolygon();
    }
  }

  const handleFeatureAdd = (e) => {
    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    setSplitButtonEnabled(false);

    const feature = e.layer.toGeoJSON();
    if (feature.geometry.type !== 'LineString') {
      onEachRegion(feature, e.layer);

      console.log("adding", feature);
      feature.properties = { drawn: true };
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
    }
    else {
      e.layer.disableEdit();
    }

    //setTransaction([...transaction, { type: 'delete', feature }]);
  };

  const handleFeatureDelete = (e) => {
    console.log(selectedLayer);
    console.log("curr poly", currentPolygon);
    if (currentPolygon !== null) {
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

  const handleSplitFeature = (e) => {

    console.log("added new vertex");
    console.log(e.layer.toGeoJSON());
    let lineString = e.layer.toGeoJSON();
    if (lineString.geometry.coordinates.length == 2) {
      console.log("stopped drawing");
      map.editTools.stopDrawing();
      map.removeLayer(e.layer);
      console.log("e", selectedPolygon);

      let lineCoords = turf.getCoords(lineString);
      let pointOne = turf.point(lineCoords[0]);
      let pointTwo = turf.point(lineCoords[1]);
      if (turf.booleanPointInPolygon(pointOne, selectedPolygon) ||
        turf.booleanPointInPolygon(pointTwo, selectedPolygon)) {
        console.log("contains vertex");
        //deSelect(currentLayer, null);

        setRenameButtonEnabled(true);
        setColorButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setSplitButtonEnabled(true);

        setAddButtonEnabled(false);
        setMergeButtonEnabled(false);

        setUndoButtonEnabled(true);
        setRedoButtonEnabled(true);

        setSplitEnabled(false);
      }
      else {
        console.log("linecoords", lineCoords);

        if (lineCoords[0][0] > lineCoords[1][0]) {
          let temp = lineCoords[0];
          lineCoords[0] = lineCoords[1];
          lineCoords[1] = temp;
        }

        let slope = (lineCoords[1][1] - lineCoords[0][1]) / (lineCoords[1][0] - lineCoords[0][0]);
        if (!isFinite(slope)) {
          slope = 9999;
        }
        let intercept = lineCoords[0][1] - slope * lineCoords[0][0];
        console.log("slope", slope);
        console.log("intercept", intercept);

        lineCoords.push([lineCoords[0][0] - .00001, lineCoords[0][1] - .00001]);
        console.log("linecoords before", lineCoords);

        let thickLineString = turf.lineString(lineCoords);
        console.log("linecoords now", lineCoords);

        let thickLinePolygon = turf.lineToPolygon(thickLineString);

        let polygonHalves = turf.difference(selectedPolygon, thickLinePolygon);
        console.log("difference is", polygonHalves);

        let largerLineCoords = [];
        if (slope > .17) {
          if ((-85 - intercept) / slope < -500) {
            largerLineCoords.push([-500, slope * (-500) + intercept]);
          }
          else {
            largerLineCoords.push([(-85 - intercept) / slope, -85]);
          }
          largerLineCoords.push(lineCoords[0]);
          largerLineCoords.push(lineCoords[1]);
          if ((85 - intercept) / slope > 500) {
            largerLineCoords.push([500, slope * (500) + intercept]);
          }
          else {
            largerLineCoords.push([(85 - intercept) / slope, 85]);
          }
          largerLineCoords.push([-500, 85]);
          largerLineCoords.push([-500, -85]);
        }
        else if (slope > 0) {
          if ((-85 - intercept) / slope < -500) {
            largerLineCoords.push([-500, slope * (-500) + intercept]);
          }
          else {
            largerLineCoords.push([(-85 - intercept) / slope, -85]);
          }
          largerLineCoords.push(lineCoords[0]);
          largerLineCoords.push(lineCoords[1]);
          if ((85 - intercept) / slope > 500) {
            largerLineCoords.push([500, slope * (500) + intercept]);
          }
          else {
            largerLineCoords.push([(85 - intercept) / slope, 85]);
          }
          largerLineCoords.push([500, 85]);
          largerLineCoords.push([-500, 85]);
        }
        else if (slope > -.17) {
          if ((85 - intercept) / slope < -500) {
            largerLineCoords.push([-500, slope * (-500) + intercept]);
          }
          else {
            largerLineCoords.push([(85 - intercept) / slope, 85]);
          }
          largerLineCoords.push(lineCoords[0]);
          largerLineCoords.push(lineCoords[1]);
          if ((-85 - intercept) / slope > 500) {
            largerLineCoords.push([500, slope * (500) + intercept]);
          }
          else {
            largerLineCoords.push([(-85 - intercept) / slope, -85]);
          }
          largerLineCoords.push([500, 85]);
          largerLineCoords.push([-500, 85]);
        }
        else {
          if ((85 - intercept) / slope < -500) {
            largerLineCoords.push([-500, slope * (-500) + intercept]);
          }
          else {
            largerLineCoords.push([(85 - intercept) / slope, 85]);
          }
          largerLineCoords.push(lineCoords[0]);
          largerLineCoords.push(lineCoords[1]);
          if ((-85 - intercept) / slope > 500) {
            largerLineCoords.push([500, slope * (500) + intercept]);
          }
          else {
            largerLineCoords.push([(-85 - intercept) / slope, -85]);
          }
          largerLineCoords.push([500, -85]);
          largerLineCoords.push([500, 85]);
        }
        console.log("coords", largerLineCoords);
        let halfScreenPolyline = turf.lineString(largerLineCoords);
        let halfScreenPolygon = turf.lineToPolygon(halfScreenPolyline);

        //let apolygon = L.geoJSON(halfScreenPolygon).addTo(map);

        let firstHalfCoords = [];
        let secondHalfCoords = [];
        console.log("halfscreen poly", halfScreenPolygon);
        for (let i = 0; i < polygonHalves.geometry.coordinates.length; i++) {
          let currPolyCoords = polygonHalves.geometry.coordinates[i];
          let currPoly = turf.polygon(currPolyCoords);
          let point = turf.pointOnFeature(currPoly);
          if (turf.booleanPointInPolygon(point, halfScreenPolygon)) {
            firstHalfCoords.push(currPolyCoords);
          }
          else {
            secondHalfCoords.push(currPolyCoords);
          }
        }
        // for (let i = 0; i < polygonHalves.geometry.coordinates.length; i++) {
        //   let currPolyCoords = polygonHalves.geometry.coordinates[i];
        //   let currPoly = turf.polygon(currPolyCoords);
        //   if (
        //     //turf.booleanOverlap(halfScreenPolygon, currPoly) || 
        //     turf.booleanContains(halfScreenPolygon, currPoly)
        //     || turf.booleanWithin(currPoly, halfScreenPolygon) 
        //     //|| turf.booleanIntersects(currPoly, halfScreenPolygon)
        //     ) {
        //     firstHalfCoords.push(currPolyCoords);
        //   }
        //   else {
        //     secondHalfCoords.push(currPolyCoords);
        //   }
        // }
        // if (firstHalfCoords.length == 0 || secondHalfCoords.length == 0) {
        //   firstHalfCoords = [];
        //   secondHalfCoords = [];
        //   for (let i = 0; i < polygonHalves.geometry.coordinates.length; i++) {
        //     let currPolyCoords = polygonHalves.geometry.coordinates[i];
        //     let currPoly = turf.polygon(currPolyCoords);
        //     if (
        //       turf.booleanOverlap(halfScreenPolygon, currPoly) || 
        //       turf.booleanContains(halfScreenPolygon, currPoly)
        //       || turf.booleanWithin(currPoly, halfScreenPolygon) 
        //       //|| turf.booleanIntersects(currPoly, halfScreenPolygon)
        //       ) {
        //       firstHalfCoords.push(currPolyCoords);
        //     }
        //     else {
        //       secondHalfCoords.push(currPolyCoords);
        //     }
        //   }
        //}
        console.log("first half", firstHalfCoords);
        console.log("secondhalf", secondHalfCoords);
        var firstHalfPolys;
        var secondHalfPolys;
        if (firstHalfCoords.length == 1) {
          firstHalfPolys = turf.polygon(firstHalfCoords[0]);
        }
        else {
          firstHalfPolys = turf.multiPolygon(firstHalfCoords);
        }
        if (secondHalfCoords.length == 1) {
          secondHalfPolys = turf.polygon(secondHalfCoords[0]);
        }
        else {
          secondHalfPolys = turf.multiPolygon(secondHalfCoords);
        }
        console.log("first half polygon", firstHalfPolys);
        console.log("second half polys", secondHalfPolys);
        firstHalfPolys.properties = { split: true }
        secondHalfPolys.properties = { split: true }


        setSplitEnabled(false);

        setRenameButtonEnabled(false);
        setColorButtonEnabled(false);
        setDeleteButtonEnabled(false);
        setSplitButtonEnabled(false);

        setAddButtonEnabled(true);
        setMergeButtonEnabled(true);

        setUndoButtonEnabled(true);
        setRedoButtonEnabled(true);

        store.addSplitPolygonsOfMapTransaction(selectedPolygon, [firstHalfPolys, secondHalfPolys]);
      }

    }
  }

  const handleFeatureDeleteVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    console.log("prev", selectedPolygon);
    console.log("updated", feature);

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
      // console.log(regionsToMerge.length);
      // for (let i = 0; i < regionsToMerge.length; i++) {
      //   regionsToMerge[i].setStyle({
      //     color: '#3388FF'
      //   });
      // }
      // regionsToMerge = [];

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
    setMergeEnabled(!mergeEnabled);


  }

  const handleEnableSplit = () => {
    console.log(splitEnabled);
    if (splitEnabled) {
      map.editTools.stopDrawing();
      //deSelect(currentLayer, null);

      setRenameButtonEnabled(true);
      setColorButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setSplitButtonEnabled(true);

      setAddButtonEnabled(false);
      setMergeButtonEnabled(false);

      setUndoButtonEnabled(true);
      setRedoButtonEnabled(true);
    }
    else {
      if (currentPolygon !== null) {
        if (map.editTools) {
          let polygon = map.editTools.startPolyline();
        }
      }
      setRenameButtonEnabled(false);
      setColorButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setMergeButtonEnabled(false);

      setAddButtonEnabled(false);
      setAddButtonEnabled(false);

      setUndoButtonEnabled(false);
      setRedoButtonEnabled(false);
    }
    setSplitEnabled(!splitEnabled);
  }

  function handleUndo() {

    store.undo();

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
  }
  function handleRedo() {
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
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Redo">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Rename">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Change Color">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Add Subregion">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Delete Subregion">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Merge Subregions">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Split Subregions">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Compress Map">
                <span>
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
                </span>
              </Tooltip>

              <Tooltip title="Info">
                <span>
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
                </span>
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