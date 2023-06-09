import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  Typography,
  Toolbar,
  Box,
  AppBar,
  Tooltip,
  SliderMarkLabel,
  TextField,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import AddIcon from "@mui/icons-material/Add";
import CompressIcon from "@mui/icons-material/Compress";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import MergeIcon from "@mui/icons-material/Merge";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CircleIcon from "@mui/icons-material/Circle";
import SouthAmericaIcon from "@mui/icons-material/SouthAmerica";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import InfoIcon from "@mui/icons-material/Info";
import PostAddIcon from "@mui/icons-material/PostAdd";
//import InfoModal from "../modals/InfoModal";
import Modal from "@mui/material/Modal";
import GlobalStoreContext from "../store";
import { useContext, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-editable";
import "leaflet/dist/leaflet.css";
import { feature } from "topojson-client";
import * as turf from "@turf/turf";
import simplify from "simplify-geojson";
/*
simplify-geojson BSD-2-Clause license
Copyright (c) <2022> <maxogden>.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
  const [propertiesButtonEnabled, setPropertiesButtonEnabled] = useState(false);
  const [compressButtonEnabled, setCompressButtonEnabled] = useState(true);
  const [propertyButtonEnabled, setPropertyButtonEnabled] = useState(false);

  const [editingProperties, setEditingProperties] = useState(false);

  const [currentView, setCurrentView] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(null);

  const [currentPolygon, setCurrentPolygon] = useState(null);
  const [currentLayer, setCurrentLayer] = useState(null);

  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [editedValues, setEditedValues] = useState({});

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
  let changedColor = "";
  let regionsToMerge = [];

  const [mergeEnabled, setMergeEnabled] = useState(false);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCompressOpen, setIsCompressOpen] = useState(false);

  const [compressionInputValue, setCompressionInputValue] = useState('');
  const [isCompressionLevelSubmit, setIsCompressionLevelSubmit] = useState(false);
  const [compressError, setCompressError] = useState('');

  useEffect(() => {
    console.log("reloading map");

    var southWest = L.latLng(-500, -500);
    var northEast = L.latLng(500, 500);
    var bounds = L.latLngBounds(southWest, northEast);

    var newmap;
    newmap = L.map("my-map", { editable: true, maxBounds: bounds });
    var geojsonMap = L.geoJson(store.currentMap.geoJsonMap, {
      onEachFeature: onEachRegion,
    });
    if (currentView) {
      newmap.setView(currentView, currentZoom);
    } else {
      var bounds = geojsonMap.getBounds();
      newmap.fitBounds(bounds);
    }

    newmap.editTools.featuresLayer.addTo(newmap);
    newmap.on("editable:drawing:end", handleFeatureAdd);
    //newmap.on('editable:vertex:dragstart', handleFeatureStartMoveVertex);
    newmap.on("editable:vertex:dragend", handleFeatureEndMoveVertex);
    newmap.on("editable:vertex:new", handleSplitFeature);
    newmap.on("editable:vertex:deleted", handleFeatureDeleteVertex);
    newmap.on("moveend", handleSetView);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 2,
    }).addTo(newmap);

    geojsonMap.eachLayer(function (layer) {
      layer.addTo(newmap);
    });
    map = newmap;
    setAMap(newmap);

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    setPropertyButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);
    setPropertiesButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    setCompressButtonEnabled(true);

    setIsPropertiesOpen(false);
    return () => {
      // Remove the map
      newmap.remove();
      if (!window.location.pathname.includes("/editmap")) {
        store.clearAllTransactions();
      }
    };
  }, [store.currentMap.geoJsonMap, mergeEnabled]);

  function selectRegion(layer) {
    if (layer.color == undefined) {
      layer.setStyle({
        color: "yellow",
      });
      layer.selected = true;
      selectedRegions.push(layer);
      //setRenameButtonEnabled(true)
    } else {
      layer.setStyle({
        color: layer.color,
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
        color: "#3388FF",
      });
      layer.selected = false;
      const index = selectedRegions.indexOf(layer);
      selectedRegions.splice(index, 1);
      //setRenameButtonEnabled(false)
    } else {
      layer.setStyle({
        color: color,
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
      } else if (country.properties.NAME_4) {
        regionName = country.properties.NAME_4;
      } else if (country.properties.NAME_3) {
        regionName = country.properties.NAME_3;
      } else if (country.properties.NAME_2) {
        regionName = country.properties.NAME_2;
      } else if (country.properties.NAME_1) {
        regionName = country.properties.NAME_1;
      } else if (country.properties.NAME_0) {
        regionName = country.properties.NAME_0;
      } else if (country.properties.admin) {
        regionName = country.properties.admin;
      } else {
        regionName = country.properties.name;
      }
      layer.bindTooltip(regionName, {
        permanent: true,
        direction: "center",
        fillColor: "blue",
      });
      if (country.properties.color) {
        layer.setStyle({
          color: country.properties.color,
        });
      }
    }

    layer.on("click", function () {
      //console.log(currentLayer.feature.properties)
      if (mergeEnabled) {
        layer.setStyle({
          color: "red",
        });
        if (regionsToMerge.indexOf(layer) == -1) {
          regionsToMerge.push(layer);
        }
        if (regionsToMerge.length == 2) {
          let merged = turf.union(
            regionsToMerge[0].feature,
            regionsToMerge[1].feature
          );
          map.removeLayer(regionsToMerge[0]);
          map.removeLayer(regionsToMerge[1]);
          L.geoJSON(merged, { onEachFeature: onEachRegion }).addTo(map);
          merged.properties = { name: "Untitled" };
          store.addmergePolygonsOfMapTransaction(
            [regionsToMerge[0].feature, regionsToMerge[1].feature],
            merged
          );
          handleEnableMerge();
        }
      } else {
        if (layer.editEnabled()) {
          setRenameButtonEnabled(false);
          setColorButtonEnabled(false);
          setPropertyButtonEnabled(false);
          setDeleteButtonEnabled(false);
          setSplitButtonEnabled(false);
          setPropertiesButtonEnabled(false);

          setAddButtonEnabled(true);
          setMergeButtonEnabled(true);
          setCompressButtonEnabled(true);

          layer.disableEdit();
          if (country.properties !== undefined) {
            console.log("there are properties");
            if (country.properties.color) {
              deSelect(layer, country.properties.color);
            } else {
              deSelect(layer, null);
            }
          } else {
            deSelect(layer, null);
          }

          selectedPolygon = null;
          selectedLayer = null;
        } else {
          console.log("selecting region");
          setRenameButtonEnabled(true);
          setColorButtonEnabled(true);
          setPropertyButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setSplitButtonEnabled(true);
          setPropertiesButtonEnabled(true);

          setAddButtonEnabled(false);
          setMergeButtonEnabled(false);
          setCompressButtonEnabled(false);

          layer.enableEdit();
          selectRegion(layer);
          prevPolygon = selectedPolygon;
          prevLayer = selectedLayer;

          if (prevPolygon !== null) {
            prevLayer.disableEdit();
            if (prevPolygon.properties !== undefined) {
              if (prevPolygon.properties.color) {
                deSelect(prevLayer, prevPolygon.properties.color);
              } else {
                deSelect(prevLayer, null);
              }
            } else {
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

        setEditedValues({});
        setEditingProperties(false);
        setEditingKey(null);
        setIsPropertiesOpen(false);
      }
    });
  }

  const handleSetView = (e) => {
    setCurrentView(map.getCenter());
    setCurrentZoom(map.getZoom());
  };

  /* If the Region Properties modal is open, and click on the "add custom property" icon in the modal
    show the text inputs
  */
  const handleAddKeyValue = (e) => {
    //console.log("here")

    if (currentLayer) {
      setEditingProperties(true);
      //console.log("1:" + JSON.stringify(currentPolygon));
      // Bind the tooltip to the layer and set its content
      //setEditingProperties(false);
    }
  };

  const handleEditSubregionName = (e) => {
    let regionName = "";

    if (currentLayer) {
      console.log("1:" + JSON.stringify(currentPolygon));
      // Bind the tooltip to the layer and set its content
      currentLayer.bindTooltip(regionName, {
        permanent: true,
        direction: "center",
        fillColor: "blue",
      });
      // Set up the click event listener on the layer
      var content = document.createElement("textarea");
      content.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
          currentLayer.bindPopup(content.value);
          regionName = content.value;
          currentLayer.setTooltipContent(content.value);

          let renamedPolygon = JSON.parse(JSON.stringify(currentPolygon));
          console.log("2:" + JSON.stringify(renamedPolygon));

          if (currentLayer.feature.properties.hasOwnProperty("NAME_5")) {
            console.log("5");
            //currentLayer.feature.properties.NAME_5 = regionName.trim();
            //trim gets rid of the '/n' which apparently is there even though console logging regionName does not have '/n'
            renamedPolygon.properties.NAME_5 = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
          } else if (currentLayer.feature.properties.hasOwnProperty("NAME_4")) {
            console.log("4");
            //currentLayer.feature.properties.NAME_4 = regionName.trim();
            renamedPolygon.properties.NAME_4 = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
          } else if (currentLayer.feature.properties.hasOwnProperty("NAME_3")) {
            console.log("3");
            //currentLayer.feature.properties.NAME_3 = regionName.trim();
            renamedPolygon.properties.NAME_3 = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
          } else if (currentLayer.feature.properties.hasOwnProperty("NAME_2")) {
            console.log("2");
            //currentLayer.feature.properties.NAME_2 = regionName.trim();
            renamedPolygon.properties.NAME_2 = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
          } else if (currentLayer.feature.properties.hasOwnProperty("NAME_1")) {
            console.log("Name_1");
            //currentLayer.feature.properties.NAME_1 = regionName.trim();
            renamedPolygon.properties.NAME_1 = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
            console.log(renamedPolygon.properties.NAME_1);
            console.log(currentPolygon.properties.NAME_1);
          } else if (currentLayer.feature.properties.hasOwnProperty("NAME_0")) {
            console.log("0");
            //currentLayer.feature.properties.NAME_0 = regionName.trim();
            renamedPolygon.properties.NAME_0 = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
          } else if (currentLayer.feature.properties.hasOwnProperty("admin")) {
            console.log("admin");
            //currentLayer.feature.properties.admin = regionName.trim();
            renamedPolygon.properties.admin = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
            console.log(renamedPolygon.properties.admin);
            console.log(currentPolygon.properties.admin);
          } else {
            console.log("created region");
            //currentLayer.feature.properties.admin = regionName.trim();
            renamedPolygon.properties.name = regionName.trim();
            console.log("3:" + JSON.stringify(renamedPolygon));
            console.log(renamedPolygon.properties.name);
            console.log(currentPolygon.properties.name);
          }

          store.addUpdatePolygonToMapTransaction(
            currentPolygon,
            renamedPolygon
          );
        }
      });
      currentLayer.bindPopup(content).openPopup();
    }
  };

  const handleChangeColor = (e) => {
    console.log("changeColor");
    if (currentLayer) {
      const colorPicker = document.createElement("input");
      colorPicker.type = "color";
      colorPicker.id = "colorpicker";

      colorPicker.addEventListener("change", function () {
        changedColor = colorPicker.value;
        console.log("Selected color:", changedColor);

        currentLayer.color = changedColor;
        currentLayer.setStyle({
          color: changedColor,
        });
        let changedColorPolygon = JSON.parse(JSON.stringify(currentPolygon));

        changedColorPolygon.properties.color = changedColor;

        store.addUpdatePolygonToMapTransaction(
          currentPolygon,
          changedColorPolygon
        );
      });
      document.body.appendChild(colorPicker);
      colorPicker.click();
    }
  };

  const handleStartPolygon = (e) => {
    setAddButtonEnabled(false);
    setMergeButtonEnabled(false);
    setCompressButtonEnabled(false);
    if (map.editTools) {
      let polygon = map.editTools.startPolygon();
    }
  };

  const handleFeatureAdd = (e) => {
    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    setCompressButtonEnabled(true);
    setSplitButtonEnabled(false);

    const feature = e.layer.toGeoJSON();
    if (feature.geometry.type !== "LineString") {
      onEachRegion(feature, e.layer);

      console.log("adding", feature);
      feature.properties = { name: "Untitled" };
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
    } else {
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
      //setPropertyButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setSplitButtonEnabled(false);
      setPropertiesButtonEnabled(false);

      setAddButtonEnabled(true);
      setMergeButtonEnabled(true);
      setCompressButtonEnabled(true);
    }
  };

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
    //setPropertyButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);
    setPropertiesButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    setCompressButtonEnabled(true);
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
      if (
        turf.booleanPointInPolygon(pointOne, selectedPolygon) ||
        turf.booleanPointInPolygon(pointTwo, selectedPolygon)
      ) {
        console.log("contains vertex");
        //deSelect(currentLayer, null);

        setRenameButtonEnabled(true);
        setColorButtonEnabled(true);
        //setPropertyButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setSplitButtonEnabled(true);
        setPropertiesButtonEnabled(true);

        setAddButtonEnabled(false);
        setMergeButtonEnabled(false);
        setCompressButtonEnabled(false);

        setUndoButtonEnabled(true);
        setRedoButtonEnabled(true);

        setSplitEnabled(false);
      } else {
        console.log("linecoords", lineCoords);

        if (lineCoords[0][0] > lineCoords[1][0]) {
          let temp = lineCoords[0];
          lineCoords[0] = lineCoords[1];
          lineCoords[1] = temp;
        }

        let slope =
          (lineCoords[1][1] - lineCoords[0][1]) /
          (lineCoords[1][0] - lineCoords[0][0]);
        if (!isFinite(slope)) {
          slope = 9999;
        }
        let intercept = lineCoords[0][1] - slope * lineCoords[0][0];
        console.log("slope", slope);
        console.log("intercept", intercept);

        lineCoords.push([
          lineCoords[0][0] - 0.00001,
          lineCoords[0][1] - 0.00001,
        ]);
        console.log("linecoords before", lineCoords);

        let thickLineString = turf.lineString(lineCoords);
        console.log("linecoords now", lineCoords);

        let thickLinePolygon = turf.lineToPolygon(thickLineString);

        let polygonHalves = turf.difference(selectedPolygon, thickLinePolygon);
        console.log("difference is", polygonHalves);

        console.log("selected poly", selectedPolygon);
        console.log("polygon halves", polygonHalves);
        console.log(selectedPolygon == polygonHalves);
        if (
          polygonHalves.geometry.type == "Polygon"
        ) {
          console.log("didnt split anything");
          setRenameButtonEnabled(true);
          setColorButtonEnabled(true);
          //setPropertyButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setSplitButtonEnabled(true);
          setPropertiesButtonEnabled(true);

          setAddButtonEnabled(false);
          setMergeButtonEnabled(false);
          setCompressButtonEnabled(false);

          setUndoButtonEnabled(true);
          setRedoButtonEnabled(true);

          setSplitEnabled(false);
        } else {
          let largerLineCoords = [];
          if (slope > 0.17) {
            if ((-85 - intercept) / slope < -500) {
              largerLineCoords.push([-500, slope * -500 + intercept]);
            } else {
              largerLineCoords.push([(-85 - intercept) / slope, -85]);
            }
            largerLineCoords.push(lineCoords[0]);
            largerLineCoords.push(lineCoords[1]);
            if ((85 - intercept) / slope > 500) {
              largerLineCoords.push([500, slope * 500 + intercept]);
            } else {
              largerLineCoords.push([(85 - intercept) / slope, 85]);
            }
            largerLineCoords.push([-500, 85]);
            largerLineCoords.push([-500, -85]);
          } else if (slope > 0) {
            if ((-85 - intercept) / slope < -500) {
              largerLineCoords.push([-500, slope * -500 + intercept]);
            } else {
              largerLineCoords.push([(-85 - intercept) / slope, -85]);
            }
            largerLineCoords.push(lineCoords[0]);
            largerLineCoords.push(lineCoords[1]);
            if ((85 - intercept) / slope > 500) {
              largerLineCoords.push([500, slope * 500 + intercept]);
            } else {
              largerLineCoords.push([(85 - intercept) / slope, 85]);
            }
            largerLineCoords.push([500, 85]);
            largerLineCoords.push([-500, 85]);
          } else if (slope > -0.17) {
            if ((85 - intercept) / slope < -500) {
              largerLineCoords.push([-500, slope * -500 + intercept]);
            } else {
              largerLineCoords.push([(85 - intercept) / slope, 85]);
            }
            largerLineCoords.push(lineCoords[0]);
            largerLineCoords.push(lineCoords[1]);
            if ((-85 - intercept) / slope > 500) {
              largerLineCoords.push([500, slope * 500 + intercept]);
            } else {
              largerLineCoords.push([(-85 - intercept) / slope, -85]);
            }
            largerLineCoords.push([500, 85]);
            largerLineCoords.push([-500, 85]);
          } else {
            if ((85 - intercept) / slope < -500) {
              largerLineCoords.push([-500, slope * -500 + intercept]);
            } else {
              largerLineCoords.push([(85 - intercept) / slope, 85]);
            }
            largerLineCoords.push(lineCoords[0]);
            largerLineCoords.push(lineCoords[1]);
            if ((-85 - intercept) / slope > 500) {
              largerLineCoords.push([500, slope * 500 + intercept]);
            } else {
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
            } else {
              secondHalfCoords.push(currPolyCoords);
            }
          }
          console.log("first half", firstHalfCoords);
          console.log("secondhalf", secondHalfCoords);
          if (firstHalfCoords.length == 0 || secondHalfCoords.length == 0) {
            console.log("didnt split anything");
            setRenameButtonEnabled(true);
            setColorButtonEnabled(true);
            //setPropertyButtonEnabled(true);
            setDeleteButtonEnabled(true);
            setSplitButtonEnabled(true);
            setPropertiesButtonEnabled(true);

            setAddButtonEnabled(false);
            setMergeButtonEnabled(false);
            setCompressButtonEnabled(false);

            setUndoButtonEnabled(true);
            setRedoButtonEnabled(true);

            setSplitEnabled(false);
          }
          else {
            var firstHalfPolys;
            var secondHalfPolys;
            if (firstHalfCoords.length == 1) {
              firstHalfPolys = turf.polygon(firstHalfCoords[0]);
            } else {
              firstHalfPolys = turf.multiPolygon(firstHalfCoords);
            }
            if (secondHalfCoords.length == 1) {
              secondHalfPolys = turf.polygon(secondHalfCoords[0]);
            } else {
              secondHalfPolys = turf.multiPolygon(secondHalfCoords);
            }

            if (selectedPolygon.properties.hasOwnProperty("NAME_5")) {
              //currentLayer.feature.properties.NAME_5 = regionName.trim();
              //trim gets rid of the '/n' which apparently is there even though console logging regionName does not have '/n'
              firstHalfPolys.properties = { NAME_5: selectedPolygon.properties.NAME_5 };
              secondHalfPolys.properties = { NAME_5: selectedPolygon.properties.NAME_5 + "2" };
            }
            else if (selectedPolygon.properties.hasOwnProperty('NAME_4')) {
              firstHalfPolys.properties = { NAME_4: selectedPolygon.properties.NAME_4 }
              secondHalfPolys.properties = { NAME_4: selectedPolygon.properties.NAME_4 + "2" }
            }
            else if (selectedPolygon.properties.hasOwnProperty('NAME_3')) {
              firstHalfPolys.properties = { NAME_3: selectedPolygon.properties.NAME_3 }
              secondHalfPolys.properties = { NAME_3: selectedPolygon.properties.NAME_3 + "2" }
            }
            else if (selectedPolygon.properties.hasOwnProperty('NAME_2')) {
              firstHalfPolys.properties = { NAME_2: selectedPolygon.properties.NAME_2 }
              secondHalfPolys.properties = { NAME_2: selectedPolygon.properties.NAME_2 + "2" }
            }
            else if (selectedPolygon.properties.hasOwnProperty('NAME_1')) {
              firstHalfPolys.properties = { NAME_1: selectedPolygon.properties.NAME_1 }
              secondHalfPolys.properties = { NAME_1: selectedPolygon.properties.NAME_1 + "2" }
            }
            else if (selectedPolygon.properties.hasOwnProperty('NAME_0')) {
              firstHalfPolys.properties = { NAME_0: selectedPolygon.properties.NAME_0 }
              secondHalfPolys.properties = { NAME_0: selectedPolygon.properties.NAME_0 + "2" }
            }
            else if (selectedPolygon.properties.hasOwnProperty('admin')) {
              firstHalfPolys.properties = { admin: selectedPolygon.properties.admin }
              secondHalfPolys.properties = { admin: selectedPolygon.properties.admin + "2" }
            }
            else {
              firstHalfPolys.properties = { name: 'Untitled' }
              secondHalfPolys.properties = { name: 'Untitled' }
            }

            console.log("first half polygon", firstHalfPolys);
            console.log("second half polys", secondHalfPolys);

            setSplitEnabled(false);

            setRenameButtonEnabled(false);
            setColorButtonEnabled(false);
            //setPropertyButtonEnabled(false);
            setDeleteButtonEnabled(false);
            setSplitButtonEnabled(false);
            setPropertiesButtonEnabled(false);

            setAddButtonEnabled(true);
            setMergeButtonEnabled(true);
            setCompressButtonEnabled(true);

            setUndoButtonEnabled(true);
            setRedoButtonEnabled(true);

            store.addSplitPolygonsOfMapTransaction(selectedPolygon, [
              firstHalfPolys,
              secondHalfPolys,
            ]);
          }
        }
      }
    }
  };

  const handleFeatureDeleteVertex = (e) => {
    const feature = e.layer.toGeoJSON();
    console.log("prev", selectedPolygon);
    console.log("updated", feature);

    store.addUpdatePolygonToMapTransaction(selectedPolygon, feature);

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    //setPropertyButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);
    setPropertiesButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    setCompressButtonEnabled(true);

    prevPolygon = selectedPolygon;
    selectedPolygon = feature;
  };

  const handleCompressMap = (e) => {
    console.log("current map: ");
    console.log(store.currentMap.geoJsonMap);
    console.log("compression level to set", (compressionInputValue));
    setIsCompressOpen(false);
    store.compressMap(parseFloat(compressionInputValue));
    setIsCompressionLevelSubmit(false);
    setIsCompressOpen(false);
    setCompressionInputValue('');

  };

  const handleCompressionInputChange = (event) => {
    setCompressionInputValue(event.target.value);
    setCompressError('');
  };

  const handleSubmitCompressionLevel = () => {
    console.log("input level", parseFloat(compressionInputValue));
    console.log("current level", store.currentMap.compressionLevel);
    if (isNaN(compressionInputValue)) {
      console.log('Error: Please provide a number.');
      setCompressError('Error: Please provide a number.');
    }
    else if (parseFloat(compressionInputValue) <= store.currentMap.compressionLevel) {
      console.log('Error: Compression level is too low.');
      setCompressError('Error: Compression level is too low.');
    } else {
      setIsCompressionLevelSubmit(true);
      setCompressError('');
      console.log('Confirmation modal');
    }
  };


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
      //setPropertyButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setSplitButtonEnabled(false);
      setPropertiesButtonEnabled(false);

      setAddButtonEnabled(true);

      setUndoButtonEnabled(true);
      setRedoButtonEnabled(true);
    } else {
      setRenameButtonEnabled(false);
      setColorButtonEnabled(false);
      //setPropertyButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setSplitButtonEnabled(false);
      setPropertiesButtonEnabled(false);

      setAddButtonEnabled(false);

      setUndoButtonEnabled(false);
      setRedoButtonEnabled(false);
    }
    setMergeEnabled(!mergeEnabled);
  };

  const handleEnableSplit = () => {
    console.log(splitEnabled);
    if (splitEnabled) {
      map.editTools.stopDrawing();
      //deSelect(currentLayer, null);

      setRenameButtonEnabled(true);
      setColorButtonEnabled(true);
      //setPropertyButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setSplitButtonEnabled(true);
      setPropertiesButtonEnabled(true);

      setAddButtonEnabled(false);
      setMergeButtonEnabled(false);
      setCompressButtonEnabled(false);

      setUndoButtonEnabled(true);
      setRedoButtonEnabled(true);
    } else {
      if (currentPolygon !== null) {
        if (map.editTools) {
          let polygon = map.editTools.startPolyline();
        }
      }
      setRenameButtonEnabled(false);
      setColorButtonEnabled(false);
      //setPropertyButtonEnabled(false);
      setDeleteButtonEnabled(false);
      setMergeButtonEnabled(false);
      setCompressButtonEnabled(false);
      setPropertiesButtonEnabled(false);

      setAddButtonEnabled(false);
      setAddButtonEnabled(false);

      setUndoButtonEnabled(false);
      setRedoButtonEnabled(false);
    }
    setSplitEnabled(!splitEnabled);
  };

  function handleUndo() {
    store.undo();

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    //setPropertyButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);
    setPropertiesButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    setCompressButtonEnabled(true);
  }
  function handleRedo() {
    store.redo();

    setRenameButtonEnabled(false);
    setColorButtonEnabled(false);
    //setPropertyButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setSplitButtonEnabled(false);
    setPropertiesButtonEnabled(false);

    setAddButtonEnabled(true);
    setMergeButtonEnabled(true);
    setCompressButtonEnabled(true);
  }

  const handleRegionProperties = () => {
    setIsPropertiesOpen(true);
    if (currentPolygon) {
      console.log(currentPolygon.properties);
    }
  };
  const handleCloseRegionProperties = () => {
    setIsPropertiesOpen(false);
  }

  const handleCloseCompress = () => {
    setIsCompressOpen(false);
    setCompressionInputValue('');
    setCompressError('');
  };
  const handleCloseCompress2 = () => {
    setIsCompressionLevelSubmit(false);
    setIsCompressOpen(false);
  };

  const handleCompress = () => {
    console.log("handle compress");
    setIsCompressOpen(true);
  };
  const handleDbClickValue = (key, value) => {
    setEditingKey(key);
    setEditedValues({ [key]: value });
  };


  const handleValueChange = (e) => {
    const { value } = e.target;
    setEditedValues({ [editingKey]: value });
  };

  const handleBlur = (e) => {
    if (e.key == 'Enter') {
      console.log("value", editedValues[editingKey]);
      // var found = false;
      // const propertiesDictionaryArray = [];
      // for (const key in currentPolygon.properties) {
      //   propertiesDictionaryArray.push({ [key]: currentPolygon.properties[key] });
      // }
      // console.log(propertiesDictionaryArray);

      let modifiedPropertiesPolygon = JSON.parse(JSON.stringify(currentPolygon));

      for (const key in modifiedPropertiesPolygon.properties) {
        if (key === editingKey) {
          // console.log("hhhhh:"+modifiedPropertiesPolygon.properties[editingKey] );
          //found = true;
          modifiedPropertiesPolygon.properties[editingKey] =
            editedValues[editingKey];
        }
      }
      store.addUpdatePolygonToMapTransaction(
        currentPolygon,
        modifiedPropertiesPolygon
      );
      /*   if (found ===false){
        modifiedPropertiesPolygon.properties[editingKey] = editedValues[editingKey];
      }
      */

      //console.log("current:" + JSON.stringify(currentPolygon));
      //console.log("modified" + JSON.stringify(modifiedPropertiesPolygon));


      setEditedValues({});
      setEditingProperties(false);
      setEditingKey(null);
      setIsPropertiesOpen(false);
    }
  };

  const handleHelpIconClick = () => {
    setIsInfoOpen(true);
  };
  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };
  const handleKeyChange = (e) => {
    console.log("key change");

    document
      .getElementById("key-change")
      .addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
          setEditingKey(e.target.value);
          console.log(editingKey);
        }
      });
  };

  const handleKeyValueChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleKeyValueSubmit = (e) => {
    if (e.key === "Enter") {
      if (editingKey !== null) {
        let modifiedPropertiesPolygon = JSON.parse(
          JSON.stringify(currentPolygon)
        );
        modifiedPropertiesPolygon.properties[editingKey] = e.target.value;

        //console.log("current:" + JSON.stringify(currentPolygon));
        //console.log("modified" + JSON.stringify(modifiedPropertiesPolygon));

        store.addUpdatePolygonToMapTransaction(
          currentPolygon,
          modifiedPropertiesPolygon
        );

        setEditedValues({});
        setEditingProperties(false);
        setEditingKey(null);
        setIsPropertiesOpen(false);
      }
    }
  }

  let propertiesContents = "";

  if (!editingProperties) {
    propertiesContents = currentPolygon && (
      <div style={{ paddingTop: "50px", paddingLeft: "10px" }}>
        {Object.entries(currentPolygon.properties).map(([key, value]) => (
          <div key={key}>
            <span>{key}: </span>
            {editingKey === key ? (
              <input
                type="text"
                value={editedValues[key] || ""}
                onChange={handleValueChange}
                onKeyDown={handleBlur}
                autoFocus
              />
            ) : (
              // <span onDoubleClick={() => handleDbClickValue(key, value)}>
              //   {value}
              // </span>
              <span onDoubleClick={() => handleDbClickValue(key, value)}>
                {value ? (
                  value
                ) : (
                  <span
                    onDoubleClick={() => handleDbClickValue(key, null)}
                  // style={{ backgroundColor: 'gray' }}
                  >
                    /
                  </span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
  else if (editingProperties && editingKey) {
    propertiesContents = currentPolygon && (
      <div style={{ paddingTop: "50px", paddingLeft: "10px" }}>
        {Object.entries(currentPolygon.properties).map(([key, value]) => (
          <div key={key}>
            <span>{key}: </span>
            {editingKey === key ? (
              <input
                type="text"
                value={editedValues[key] || ""}
                onChange={handleValueChange}
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => handleDbClickValue(key, value)}>
                {value}
              </span>
            )}
          </div>
        ))}
        {editingKey}
        :
        <input
          type="text"
          id="value-change"
          class="property input"
          name="value"
          style={{ width: "100px", marginLeft: "5px" }}
          onChange={handleKeyValueChange}
          onKeyDown={handleKeyValueSubmit}
        />
      </div>
    );
  }
  else {
    propertiesContents = currentPolygon && (
      <div style={{ paddingTop: "50px", paddingLeft: "10px" }}>
        {Object.entries(currentPolygon.properties).map(([key, value]) => (
          <div key={key}>
            <span>{key}: </span>
            {editingKey === key ? (
              <input
                type="text"
                value={editedValues[key] || ""}
                onChange={handleValueChange}
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => handleDbClickValue(key, value)}>
                {value}
              </span>
            )}
          </div>
        ))}
        <input
          type="text"
          id="key-change"
          class="property input"
          name="key"
          style={{ width: "100px", marginRight: "5px" }}
          onChange={handleKeyChange}
        />
        :
        {/* <input
          type="text"
          id="value-change"
          class="property input"
          name="value"
          style={{ width: "100px", marginLeft: "5px" }}
          onChange={handleKeyValueChange}
        /> */}
      </div>
    );
  }

  return (
    <div>
      <div id="create-map-screen">
        <IconButton
          aria-label="back"
          onClick={(event) => {
            store.updateThumbnailOfMap(store.currentMap._id, "/createmap");
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
                    disabled={!store.canUndo() || !undoButtonEnabled}
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
                    disabled={!store.canRedo() || !redoButtonEnabled}
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
                    disabled={!compressButtonEnabled}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleCompress}
                  >
                    <CompressIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Modal
                open={isCompressOpen}
                onClose={handleCloseCompress}
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 380,
                  height: 220,
                  backgroundColor: "#145374",
                  color: "#FFE484",
                  border: "2px solid #000",
                  boxShadow: 24,
                  borderRadius: 10,
                  p: 4,
                  overflowY: "auto",
                }}
              >
                <div>
                  <div>
                    <Button
                      variant="contained"
                      sx={{ maxWidth: 100 }}
                      style={{
                        borderRadius: 50,
                        backgroundColor: "#FFE484",
                        padding: "7px 34px",
                        margin: "10px 10px",
                        fontSize: "10px",
                        color: "#000000",
                        size: "small",
                        position: "absolute",
                        right: "0%",
                      }}
                      onClick={handleCloseCompress}
                    >
                      X
                    </Button>
                  </div>

                  <br></br>
                  <br></br>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{ padding: "5px", marginBottom: "10px", textAlign: 'center' }}
                  >
                    Enter Compression Level <br />
                    Current level: {store.currentMap.compressionLevel}
                  </Typography>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField
                      id="compression-textfield"
                      label="Compression Level"
                      variant="filled"
                      style={{ backgroundColor: 'white' }}
                      value={compressionInputValue}
                      onChange={handleCompressionInputChange}
                    />

                    <Button
                      variant="contained"
                      sx={{ maxWidth: 100 }}
                      style={{
                        borderRadius: 50,
                        backgroundColor: "#AEAFFF",
                        padding: "7px 34px",
                        margin: "10px 10px",
                        fontSize: "13px",
                        color: "#000000",
                      }}
                      onClick={handleSubmitCompressionLevel}
                    >
                      Submit
                    </Button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', color: 'red', marginTop: '10px' }}>
                    {compressError}
                  </div>




                </div>
              </Modal>

              <Modal
                open={isCompressionLevelSubmit}
                onClose={handleCloseCompress2}
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 380,
                  height: 220,
                  backgroundColor: "#145374",
                  color: "#FFE484",
                  border: "2px solid #000",
                  boxShadow: 24,
                  borderRadius: 10,
                  p: 4,
                  overflowY: "auto",
                }}
              >
                <div>
                  <div>
                    <Button
                      variant="contained"
                      sx={{ maxWidth: 100 }}
                      style={{
                        borderRadius: 50,
                        backgroundColor: "#FFE484",
                        padding: "7px 34px",
                        margin: "10px 10px",
                        fontSize: "10px",
                        color: "#000000",
                        size: "small",
                        position: "absolute",
                        right: "0%",
                      }}
                      onClick={handleCloseCompress2}
                    >
                      X
                    </Button>
                  </div>

                  <br></br>
                  <br></br>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{ padding: "5px", margin: "10px", textAlign: 'center' }}
                  >
                    Are you sure you want to Compress? This cannot be undone.
                  </Typography>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{ maxWidth: 100 }}
                      style={{
                        borderRadius: 50,
                        backgroundColor: "#AEAFFF",
                        padding: "7px 34px",
                        margin: "10px 10px",
                        fontSize: "13px",
                        color: "#000000",
                      }}
                      onClick={handleCompressMap}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ maxWidth: 100 }}
                      style={{
                        borderRadius: 50,
                        backgroundColor: "#FFE484",
                        padding: "7px 34px",
                        margin: "10px 10px",
                        fontSize: "13px",
                        color: "#000000",
                      }}
                      onClick={handleCloseCompress2}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Modal>

              <Tooltip title="Subregion Properties">
                <span>
                  <IconButton
                    disabled={!propertiesButtonEnabled}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleRegionProperties}
                  >
                    <ReceiptLong />
                  </IconButton>
                </span>
              </Tooltip>

              <Modal
                open={isPropertiesOpen}
                onClose={handleCloseRegionProperties}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "90%",
                  transform: "translate(-50%, -50%)",
                  width: 280,
                  height: 300,
                  backgroundColor: "#145374",
                  color: "#FFE484",
                  border: "2px solid #000",
                  boxShadow: 24,
                  borderRadius: 10,
                  p: 4,
                  overflowY: "auto",
                }}
              >
                <div>
                  <Button
                    variant="contained"
                    sx={{ maxWidth: 100 }}
                    style={{
                      borderRadius: 50,
                      backgroundColor: "#FFE484",
                      padding: "7px 34px",
                      margin: "10px 10px",
                      fontSize: "10px",
                      color: "#000000",
                      size: "small",
                      position: "absolute",
                      right: "0%",
                    }}
                    onClick={handleCloseRegionProperties}
                  >
                    X
                  </Button>
                  {propertiesContents}
                  <IconButton color="inherit" onClick={handleAddKeyValue}>
                    <PostAddIcon />
                  </IconButton>
                </div>
              </Modal>

              <Tooltip title="Info">
                <span>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleHelpIconClick}
                  >
                    <InfoIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Toolbar>

            <Modal
              open={isInfoOpen}
              onClose={handleCloseInfo}
              style={{
                position: "absolute",
                top: "55%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 800,
                height: 600,
                backgroundColor: "#145374",
                color: "#FFE484",
                border: "2px solid #000",
                boxShadow: 24,
                borderRadius: 10,
                p: 4,
                overflowY: "auto",
              }}
            >
              <div style={{ padding: "5px" }}>
                <Button
                  variant="contained"
                  sx={{ maxWidth: 100 }}
                  style={{
                    borderRadius: 50,
                    backgroundColor: "#FFE484",
                    padding: "7px 34px",
                    margin: "10px 10px",
                    fontSize: "13px",
                    color: "#000000",
                    position: "absolute",
                    right: "0%",
                  }}
                  onClick={handleCloseInfo}
                >
                  X
                </Button>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ padding: "5px", margin: "10px" }}
                >
                  Hover over an icon to see its purpose.
                  <br></br>
                  <br></br>
                  Click on a subregion to select it. It will be highlighted. The
                  white squares are its corresponding vertices.
                  <br></br>Click on a translucent square to add the vertex to
                  the subregion.<br></br>
                  Click on an opaque square to delete the vertex. <br></br>Hold
                  and drag an opaque square to move the vertex.
                  <br></br>
                  To unselect a subregion, click it again.
                  <br></br>
                  <br></br>
                  Changes made are saved automatically. You can undo or redo if
                  you made changes. You can not undo or redo previous changes
                  from your last session.
                  <br></br>
                  <br></br>
                  <IconButton color="inherit">
                    <UndoIcon />
                  </IconButton>
                  Undo a change.
                  <br></br>
                  <IconButton color="inherit">
                    <RedoIcon />
                  </IconButton>
                  Redo a change.
                  <br></br>
                  <IconButton color="inherit">
                    <BorderColorIcon />
                  </IconButton>
                  Rename a selected subregion.
                  <br></br>
                  <IconButton color="inherit">
                    <FormatColorFillIcon />
                  </IconButton>
                  Change the color for a selected subregion. Click on the map to
                  confirm.
                  <br></br>
                  <IconButton color="inherit">
                    <AddIcon />
                  </IconButton>
                  Add a subregion. Begin clicking to add vertices. Once you are
                  done outlining the subregion, click on the last vertex you
                  added.
                  <br></br>
                  <IconButton color="inherit">
                    <DeleteIcon />
                  </IconButton>
                  Delete the selected subregion.
                  <br></br>
                  <IconButton color="inherit">
                    <MergeIcon />
                  </IconButton>
                  Merge two subregions. Click on the Merge button and then
                  select two subregions. They will be merged after you have
                  selected the second subregion. Keep in mind that colors from
                  selected subregions will not be inherited.
                  <br></br>
                  <IconButton color="inherit">
                    <CallSplitIcon />
                  </IconButton>
                  Split a selected subregion into two. Click two vertices on a
                  subregion to split the subregion along the line connecting
                  those vertices.
                  <br></br>
                  <IconButton color="inherit">
                    <CompressIcon />
                  </IconButton>
                  Compress the map. This will make the map less detailed as it
                  will have less data. This action is irreversible.
                  <br></br>
                  <IconButton color="inherit">
                    <ReceiptLong />
                  </IconButton>
                  Shows the properties of a selected subregion. You can
                  doubleclick a property to edit it. Enter to submit your changes.
                  <br></br>
                  <IconButton color="inherit">
                    <PostAddIcon />
                  </IconButton>
                  Add custom properties to a selected subregion. This button is
                  in the Subregion Properties popup. Properties consist of a key:value pair. Both entries are required. Enter to submit after you are done typing. 
                  The input for value will appear after you have submitted the key.
                </Typography>
              </div>
            </Modal>
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
