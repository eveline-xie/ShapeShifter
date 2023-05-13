import { createContext, useContext, useEffect, useState } from 'react'
import api from './store-request-api'

import jsTPS from '../common/jsTPS'
import AddPolygon_Transaction from '../transactions/AddPolygon_Transaction'
import UpdatePolygon_Transaction from '../transactions/UpdatePolygon_Transaction'
import DeletePolygon_Transaction from '../transactions/DeletePolygon_Transaction'
import MergePolygons_Transaction from '../transactions/MergePolygons_Transaction'
import SplitPolygon_Transaction from '../transactions/SplitPolygon_Transaction'

import AuthContext from '../auth'
import { Global } from '@emotion/react'
import shpjs from 'shpjs';
import { useNavigate } from 'react-router-dom';

import * as topoServer from 'topojson-server';
import * as topoClient from 'topojson-client';
import * as topoSimplify from 'topojson-simplify';
import L from 'leaflet';

import { io } from "socket.io-client"
const shpwrite = require('shp-write');


export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");


export const GlobalStoreActionType = {
  CREATE_NEW_MAP: "CREATE_NEW_MAP",
  LOAD_USER_MAPS: "LOAD_USER_MAPS",
  LOAD_CURRENT_MAP: "LOAD_CURRENT_MAP",
  MARK_MAP_FOR_DELETION: "MARK_MAP_FOR_DELETION",
  MARK_MAP_FOR_EXPORT: "MARK_MAP_FOR_EXPORT",
  LOAD_PUBLISHED_MAPS: "LOAD_PUBLISHED_MAPS",
  LOAD_SHARED_MAPS: "LOAD_SHARED_MAPS",
  LOAD_COMMENTS: "LOAD_COMMENTS",
  FORK_MAP: "FORK_MAP",
};

const tps = new jsTPS();

const socket = new io(
  "http://localhost:5000"
  //"https://shapeshifter-api.onrender.com"
  , {
    autoConnect: false,
  }
)

console.log("setup global store");

function GlobalStoreContextProvider(props) {
  const { auth } = useContext(AuthContext);
  useEffect(() => {
    if (auth.loggedIn) {
      console.log("connecting socket");
      socket.connect();
    }
    return () => {
      console.log("disconnecting socket");
      socket.disconnect();
    };
  }, [auth.loggedIn]);
  const [store, setStore] = useState({
    currentMap: null,
    userMaps: null,
    publishedMaps: null,
    mapIdMarkedForDeletion: null,
    mapIdMarkedForExport: null,
    sharedMaps: null,
    mapComments: null,
  })

  const navigate = useNavigate();


  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case GlobalStoreActionType.CREATE_NEW_MAP: {
        return setStore({
          currentMap: payload,
          userMaps: store.userMaps,
        });
      }
      case GlobalStoreActionType.LOAD_USER_MAPS: {
        return setStore({
          currentMap: store.currentMap,
          userMaps: payload.reverse(),
          publishedMaps: store.publishedMaps,
        });
      }
      case GlobalStoreActionType.LOAD_CURRENT_MAP: {
        return setStore({
          currentMap: payload,
          userMaps: store.userMaps,
        });
      }
      case GlobalStoreActionType.MARK_MAP_FOR_DELETION: {
        return setStore({
          userMaps: store.userMaps,
          mapIdMarkedForDeletion: payload,
        });
      }
      case GlobalStoreActionType.MARK_MAP_FOR_EXPORT: {
        return setStore({
          currentMap: store.currentMap,
          userMaps: store.userMaps,
          publishedMaps: store.publishedMaps,
          mapIdMarkedForExport: payload,
        });
      }
      case GlobalStoreActionType.FORK_MAP: {
        return setStore({
          currentMap: store.currentMap,
          userMaps: store.userMaps,
          publishedMaps: store.publishedMaps,
        });
      }
      case GlobalStoreActionType.LOAD_PUBLISHED_MAPS: {
        return setStore({
          publishedMaps: payload.reverse(),
        });
      }
      case GlobalStoreActionType.LOAD_SHARED_MAPS: {
        return setStore({
          sharedMaps: payload.reverse(),
        });
      }
      case GlobalStoreActionType.LOAD_COMMENTS: {
        return setStore({
          mapComments: payload,
          publishedMaps: store.publishedMaps,
        });
      }
    }
  }

  store.onEachRegion = function (country, layer) {
    if (country.properties !== undefined) {
      if (country.properties.color) {
        layer.setStyle({
          color: country.properties.color
        })
      }
    }
  }

  store.createNewMapSHPDBF = async function (shpfile, dbffile) {

    let shpfileContents = shpjs.parseShp(shpfile);
    let dbffileContents = shpjs.parseDbf(dbffile);
    let shp2geoContents = shpjs.combine([shpfileContents, dbffileContents]);
    console.log("test", shp2geoContents);

    let top = topoServer.topology({ foo: shp2geoContents });
    let top2 = topoSimplify.presimplify(top);
    let top3 = topoSimplify.simplify(top2, .005);
    let feature = topoClient.feature(top3, "foo");
    console.log("feature", feature);

    feature.features.forEach(function (feature) {
      if (feature.geometry.type === 'MultiPolygon') {
        for (var i = feature.geometry.coordinates.length - 1; i >= 0; i--) {
          var polygon = feature.geometry.coordinates[i];
          var filteredPolygon = polygon.filter(function (ring) {
            return !(ring.length === 4 && ring[0][0] === ring[1][0] && ring[0][1] === ring[1][1] && ring[1][0] === ring[2][0] && ring[1][1] === ring[2][1] && ring[2][0] === ring[0][0] && ring[2][1] === ring[0][1]);
          });
          if (filteredPolygon.length === 0) {
            feature.geometry.coordinates.splice(i, 1);
          } else {
            feature.geometry.coordinates[i] = filteredPolygon;
          }
        }
      }
    });

    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);

    var southWest = L.latLng(-500, -500);
    var northEast = L.latLng(500, 500);
    var bounds = L.latLngBounds(southWest, northEast);

    let map = L.map(container, { maxBounds: bounds });
    var geojsonMap =
      L.geoJson(feature, {
        onEachFeature: store.onEachRegion
      });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var bounds = geojsonMap.getBounds();
    map.fitBounds(bounds);

    geojsonMap.eachLayer(function (layer) {
      //console.log(layer);
      layer.addTo(map);
    })

    let format = 'image';
    var screenshot = L.simpleMapScreenshoter().addTo(map);

    screenshot.takeScreen(format).then(async image => {
      map.remove();
      container.parentNode.removeChild(container);
      const response = await api.createNewMap({ map: feature, thumbnail: image });
      if (response.status === 201) {
        //tps.clearAllTransactions();
        let newMap = response.data.map;
        console.log(newMap);
        storeReducer({
          type: GlobalStoreActionType.CREATE_NEW_MAP,
          payload: newMap
        }
        );

        // IF IT'S A VALID LIST THEN LET'S START EDITING IT
        //history.push("/playlist/" + newList._id);
        navigate("/createmap");
      }
      else {
        console.log("API FAILED TO CREATE A NEW LIST");
      }
    })
  }

  store.createNewMapGeoJson = async function (geojsonfile) {
    let textDecoder = new TextDecoder("utf-8");
    let jsonString = textDecoder.decode(geojsonfile);
    let featureCollection = JSON.parse(jsonString);
    console.log("featurecollection", featureCollection);

    let top = topoServer.topology({ foo: featureCollection });
    let top2 = topoSimplify.presimplify(top);
    let top3 = topoSimplify.simplify(top2, .005);
    let feature = topoClient.feature(top3, "foo");

    feature.features.forEach(function (feature) {
      if (feature.geometry.type === 'MultiPolygon') {
        for (var i = feature.geometry.coordinates.length - 1; i >= 0; i--) {
          var polygon = feature.geometry.coordinates[i];
          var filteredPolygon = polygon.filter(function (ring) {
            return !(ring.length === 4 && ring[0][0] === ring[1][0] && ring[0][1] === ring[1][1] && ring[1][0] === ring[2][0] && ring[1][1] === ring[2][1] && ring[2][0] === ring[0][0] && ring[2][1] === ring[0][1]);
          });
          if (filteredPolygon.length === 0) {
            feature.geometry.coordinates.splice(i, 1);
          } else {
            feature.geometry.coordinates[i] = filteredPolygon;
          }
        }
      }
    });

    var container = document.createElement('div');
    container.style.height = '500px';
    container.style.width = '500px';
    document.body.appendChild(container);

    var southWest = L.latLng(-500, -500);
    var northEast = L.latLng(500, 500);
    var bounds = L.latLngBounds(southWest, northEast);

    let map = L.map(container, { maxBounds: bounds });
    var geojsonMap =
      L.geoJson(feature, {
        onEachFeature: store.onEachRegion
      });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var bounds = geojsonMap.getBounds();
    map.fitBounds(bounds);

    geojsonMap.eachLayer(function (layer) {
      //console.log(layer);
      layer.addTo(map);
    })

    let format = 'image';
    var screenshot = L.simpleMapScreenshoter().addTo(map);

    screenshot.takeScreen(format).then(async image => {
      map.remove();
      container.parentNode.removeChild(container);
      const response = await api.createNewMap({ map: feature, thumbnail: image });
      if (response.status === 201) {
        //tps.clearAllTransactions();
        let newMap = response.data.map;
        console.log(newMap);
        storeReducer({
          type: GlobalStoreActionType.CREATE_NEW_MAP,
          payload: newMap
        }
        );

        // IF IT'S A VALID LIST THEN LET'S START EDITING IT
        //history.push("/playlist/" + newList._id);
        navigate("/createmap");
      }
      else {
        console.log("API FAILED TO CREATE A NEW LIST");
      }
    })
  }

  store.updateMapCustomProperties = async function (name, keywords, collaborators) {
    // let keywordsArray = keywords.split(/[\s,]+/);
    // let collaboratorsArray = collaborators.split((/[\s,]+/))
    let keywordsArray = keywords;
    let collaboratorsArray = collaborators;
    let payload = {
      name: name,
      keywords: keywordsArray,
      collaborators: collaboratorsArray
    }
    console.log(this.currentMap._id, name, keywordsArray, collaboratorsArray);
    const response = await api.updateMapCustomProperties(this.currentMap._id, payload);
    if (response.status === 201) {
      //tps.clearAllTransactions();
      let newMap = response.data.map;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_MAP,
        payload: newMap
      }
      );

      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      //history.push("/playlist/" + newList._id);
      navigate("/home");
    }
    else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  }

  store.loadUserMaps = async function () {
    const response = await api.loadUserMaps();
    if (response.status === 201) {
      console.log(response.data.userMaps);
      storeReducer({
        type: GlobalStoreActionType.LOAD_USER_MAPS,
        payload: response.data.userMaps
      })
    }
  }

  store.loadUserMapsNoGeoJson = async function () {
    const response = await api.loadUserMapsNoGeoJson();
    if (response.status === 201) {
      console.log(response.data.userMapsNoGeoJson);
      storeReducer({
        type: GlobalStoreActionType.LOAD_USER_MAPS,
        payload: response.data.userMapsNoGeoJson
      })
    }
  }

  store.loadMapById = async function (id) {
    const response = await api.getMapById(id);
    if (response.status === 201) {
      console.log(response.data.currentMap);
      storeReducer({
        type: GlobalStoreActionType.LOAD_CURRENT_MAP,
        payload: response.data.currentMap
      })
      if (
        window.location.pathname == "/home" ||
        window.location.pathname == "/shared"
      ) {
        navigate("/createmap");
      }
    }
  }

  store.duplicateMapById = async function (id) {
    const response = await api.duplicateMapById({ id: id });
    if (response.status === 201) {
      store.loadUserMapsNoGeoJson();
      storeReducer({
        type: GlobalStoreActionType.FORK_MAP,
      });
    }
  }

  store.markMapForDeletion = function (id) {
    console.log("marking this id to delete", id);
    storeReducer({
      type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
      payload: id
    })
  }

  store.deleteMarkedList = async function () {
    console.log("delete", store.mapIdMarkedForDeletion);
    let response = await api.deleteMapById(store.mapIdMarkedForDeletion);
    if (response.status === 201) {
      store.loadUserMapsNoGeoJson();
    }
  }

  store.markMapForExport = function (id) {
    console.log("marking this id to export", id);
    storeReducer({
      type: GlobalStoreActionType.MARK_MAP_FOR_EXPORT,
      payload: id
    })
  }

  store.exportToGeoJSON = async function () {
    const response = await api.getMapById(store.mapIdMarkedForExport);
    if (response.status === 201) {
      console.log("downloading geojson ", response.data.currentMap);
      const map = response.data.currentMap;
      const json = JSON.stringify(map.geoJsonMap);
      console.log("download geojson", json)
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = map.name + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }
  }

  store.exportToSHPDBF = async function () {
    const response = await api.getShpDbfFileById(store.mapIdMarkedForExport);
    //const response = await api.getMapById(store.mapIdMarkedForExport);
    if (response.status === 201) {
      const map = response.data;
      console.log(map);
      console.log("after");
      // const blob = new Blob([shp], { type: 'application/zip' });
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = map.name + '.zip';
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      // URL.revokeObjectURL(url);

      // shpjs.zip(map.geoJsonMap).then(function(content) {
      //     // content is a Blob containing the zipped shapefile
      //     // Do something with the shapefile, such as download it
      //     saveAs(content, 'myshapefile.zip');
      //   });

    }
  }

  store.undo = function () {
    tps.undoTransaction();
  }
  store.redo = function () {
    tps.doTransaction();
  }

  store.canUndo = function () {
    return ((store.currentMap !== null) && tps.hasTransactionToUndo());
  }
  store.canRedo = function () {
    return ((store.currentMap !== null) && tps.hasTransactionToRedo());
  }

  store.clearAllTransactions = function () {
    tps.clearAllTransactions();
  }

  store.addAddPolygonToMapTransaction = function (feature) {
    let transaction = new AddPolygon_Transaction(store, feature);
    tps.addTransaction(transaction);
  }

  // store.addPolygonToMap = async function (feature) {
  //   const response = await api.addPolygonToMap(store.currentMap._id, feature);
  //   if (response.status === 201) {
  //     console.log("success");
  //     const map = response.data.map;
  //     console.log(map.geoJsonMap.features.length);
  //     storeReducer({
  //       type: GlobalStoreActionType.LOAD_CURRENT_MAP,
  //       payload: map
  //     })
  //   }
  // }


  socket.on("connection", (data) => {
    console.log(data);
  });

  store.addPolygonToMap = function (feature) {
    console.log("emitting add");
    socket.emit("add-polygon", store.currentMap._id, feature);
  }

  socket.on("add-polygon-response", (data) => {
    const map = data;
    storeReducer({
      type: GlobalStoreActionType.LOAD_CURRENT_MAP,
      payload: map
    })
  });

  store.addUpdatePolygonToMapTransaction = function (prevPolygon, updatedPolygon) {
    let transaction = new UpdatePolygon_Transaction(store, prevPolygon, updatedPolygon);
    tps.addTransaction(transaction);
  }
  // store.updatePolygonOfMap = async function (prevPolygon, updatedPolygon) {
  //   const response = await api.updatePolygonOfMap(store.currentMap._id, prevPolygon, updatedPolygon);
  //   if (response.status === 201) {
  //     console.log("success");
  //     const map = response.data.map;
  //     console.log(map.geoJsonMap.features.length);
  //     storeReducer({
  //       type: GlobalStoreActionType.LOAD_CURRENT_MAP,
  //       payload: map
  //     })
  //   }
  // }
  store.updatePolygonOfMap = function (prevPolygon, updatedPolygon) {
    console.log("emitting update");
    socket.emit("update-polygon", store.currentMap._id, prevPolygon, updatedPolygon);
  }

  socket.on("update-polygon-response", (data) => {
    const map = data;
    storeReducer({
      type: GlobalStoreActionType.LOAD_CURRENT_MAP,
      payload: map
    })
  });

  store.addDeletePolygonOfMapTransaction = function (feature) {
    let transaction = new DeletePolygon_Transaction(store, feature);
    tps.addTransaction(transaction);
  }

  // store.deletePolygonOfMap = async function (feature) {
  //   const response = await api.deletePolygonOfMap(store.currentMap._id, feature);
  //   if (response.status === 201) {
  //     console.log("ww");
  //     const map = response.data.map;
  //     console.log(map.geoJsonMap.features.length);
  //     storeReducer({
  //       type: GlobalStoreActionType.LOAD_CURRENT_MAP,
  //       payload: map
  //     })
  //   }
  // }

  store.deletePolygonOfMap = function (feature) {
    console.log("emitting delete");
    socket.emit("delete-polygon", store.currentMap._id, feature);
  }

  socket.on("delete-polygon-response", (data) => {
    const map = data;
    storeReducer({
      type: GlobalStoreActionType.LOAD_CURRENT_MAP,
      payload: map
    })
  });

  store.addmergePolygonsOfMapTransaction = function (polygonsToMerge, mergedPolygon) {
    let transaction = new MergePolygons_Transaction(store, polygonsToMerge, mergedPolygon);
    tps.addTransaction(transaction);
  }

  // store.mergePolygonsOfMap = async function (polygonsToMerge, mergedPolygon) {
  //   const response = await api.mergePolygonsOfMap(store.currentMap._id, polygonsToMerge, mergedPolygon);
  //   if (response.status === 201) {
  //     console.log("success");
  //     const map = response.data.map;
  //     console.log(map.geoJsonMap.features.length);
  //     storeReducer({
  //       type: GlobalStoreActionType.LOAD_CURRENT_MAP,
  //       payload: map
  //     })
  //   }
  // }
  store.mergePolygonsOfMap = async function (polygonsToMerge, mergedPolygon) {
    console.log("emitting merge");
    socket.emit("merge-polygons", store.currentMap._id, polygonsToMerge, mergedPolygon);
  }

  socket.on("merge-polygons-response", (data) => {
    const map = data;
    storeReducer({
      type: GlobalStoreActionType.LOAD_CURRENT_MAP,
      payload: map
    })
  });

  // store.undoMergePolygonsOfMap = async function (polygonsToMerge, mergedPolygon) {
  //   const response = await api.undoMergePolygonsOfMap(store.currentMap._id, polygonsToMerge, mergedPolygon);
  //   if (response.status === 201) {
  //     console.log("success");
  //     const map = response.data.map;
  //     console.log(map.geoJsonMap.features.length);
  //     storeReducer({
  //       type: GlobalStoreActionType.LOAD_CURRENT_MAP,
  //       payload: map
  //     })
  //   }
  // }

  store.undoMergePolygonsOfMap = async function (polygonsToMerge, mergedPolygon) {
    console.log("emitting undo merge");
    socket.emit("undo-merge-polygons", store.currentMap._id, polygonsToMerge, mergedPolygon);
  }

  socket.on("undo-merge-polygons-response", (data) => {
    const map = data;
    storeReducer({
      type: GlobalStoreActionType.LOAD_CURRENT_MAP,
      payload: map
    })
  });

  store.addSplitPolygonsOfMapTransaction = function (polygonToSplit, splitPolygons) {
    let transaction = new SplitPolygon_Transaction(store, polygonToSplit, splitPolygons);
    tps.addTransaction(transaction);
  }



  store.updateThumbnailOfMap = async function (id) {
    const response = await api.getMapById(id);
    if (response.status === 201) {
      let features = response.data.currentMap.geoJsonMap;
      var container = document.createElement('div');
      container.style.height = '500px';
      container.style.width = '500px';
      document.body.appendChild(container);

      var southWest = L.latLng(-500, -500);
      var northEast = L.latLng(500, 500);
      var bounds = L.latLngBounds(southWest, northEast);

      let map = L.map(container, { maxBounds: bounds });
      var geojsonMap =
        L.geoJson(features, {
          onEachFeature: store.onEachRegion
        });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      var bounds = geojsonMap.getBounds();
      map.fitBounds(bounds);

      geojsonMap.eachLayer(function (layer) {
        //console.log(layer);
        layer.addTo(map);
      })

      let format = 'image';
      var screenshot = L.simpleMapScreenshoter().addTo(map);

      screenshot.takeScreen(format).then(async image => {
        map.remove();
        container.parentNode.removeChild(container);
        const response = await api.updateThumbnailOfMap(id, image);
        console.log("updatedMap response: " + response);
        if (response.status === 201) {
          //tps.clearAllTransactions();
          let updatedMap = response.data.map;
          console.log(updatedMap);
          storeReducer({
            type: GlobalStoreActionType.LOAD_CURRENT_MAP,
            payload: updatedMap
          }
          );

          // IF IT'S A VALID LIST THEN LET'S START EDITING IT
          //history.push("/playlist/" + newList._id);
          navigate("/createmap");
        }
        else {
          console.log("API FAILED TO CREATE A NEW LIST");
        }
      })

    }

  }

  store.publishMap = async function () {
    const response = await api.publishMap(
      store.currentMap._id
    );
    if (response.status === 201) {
      console.log("published");
      navigate("/home");
    }
  };

  store.loadPublishedMaps = async function (id) {
    const response = await api.loadPublishedMaps();
    if (response.status === 201) {
      console.log(response.data.publishedMaps);
      storeReducer({
        type: GlobalStoreActionType.LOAD_PUBLISHED_MAPS,
        payload: response.data.publishedMaps,
      });
    }
  };

  store.loadSharedMaps = async function () {
    const response = await api.loadSharedMaps();
    if (response.status === 201) {
      console.log(response.data.sharedMaps);
      storeReducer({
        type: GlobalStoreActionType.LOAD_SHARED_MAPS,
        payload: response.data.sharedMaps,
      });
    }
  };

  store.updateMapComments = async function (
    comments,
    mapid
  ) {
    let payload = {
      comments: comments,
      mapid: mapid,
    };
    console.log(payload);
    const response = await api.updateMapComments(
      payload
    );
    if (response.status === 201) {
      console.log("comment success")
      console.log(response.data.mapComments)
      storeReducer({
        type: GlobalStoreActionType.LOAD_COMMENTS,
        payload: response.data.mapComments,
      });
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };

  store.loadComments = async function (mapid) {
    const response = await api.loadComments(mapid);
    if (response.status === 201) {
      console.log("comment success");
      console.log(response.data.mapComments);
      storeReducer({
        type: GlobalStoreActionType.LOAD_COMMENTS,
        payload: response.data.mapComments,
      });
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  }

  store.removeSharedMap = async function (mapid, email) {
    const response = await api.removeSharedMap(mapid, email);
    if (response.status === 201) {
      console.log("map removed from shared with me");
    }
  }

  return (
    <GlobalStoreContext.Provider value={{
      store
    }}>
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };