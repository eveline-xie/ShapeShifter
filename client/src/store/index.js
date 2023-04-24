import { createContext, useContext, useState } from 'react'
import api from './store-request-api'
// import jsTPS from '../common/jsTPS'
// import api from './store-request-api'
// import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
// import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
// import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
// import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
import { Global } from '@emotion/react'
import shpjs from 'shpjs';
import { useNavigate } from 'react-router-dom';

import * as topoServer from 'topojson-server';
import * as topoClient from 'topojson-client';
import * as topoSimplify from 'topojson-simplify';
import L from 'leaflet';
import leafletImage from 'leaflet-image';


export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    LOAD_USER_MAPS: "LOAD_USER_MAPS",
    LOAD_CURRENT_MAP: "LOAD_CURRENT_MAP",
    MARK_MAP_FOR_DELETION: "MARK_MAP_FOR_DELETION",
    MARK_MAP_FOR_EXPORT: "MARK_MAP_FOR_EXPORT"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentMap: null,
        userMaps: null,
        mapIdMarkedForDeletion: null,
        mapIdMarkedForExport: null,
    })

    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CREATE_NEW_MAP: {
                return setStore({
                    currentMap: payload,
                    userMaps: store.userMaps
                })
            }
            case GlobalStoreActionType.LOAD_USER_MAPS: {
                return setStore({
                    currentMap: store.currentMap,
                    userMaps: payload
                })
            }
            case GlobalStoreActionType.LOAD_CURRENT_MAP: {
                return setStore({
                    currentMap: payload,
                    userMaps: store.userMaps
                })
            }
            case GlobalStoreActionType.MARK_MAP_FOR_DELETION: {
                return setStore({
                    userMaps: store.userMaps,
                    mapIdMarkedForDeletion: payload
                })
            }
            case GlobalStoreActionType.MARK_MAP_FOR_EXPORT: {
                return setStore({
                    currentMap: store.currentMap,
                    userMaps: store.userMaps,
                    mapIdMarkedForExport: payload
                })
            }
        }
    }

    store.createNewMapSHPDBF = async function (shpfile, dbffile) {

        let shpfileContents = shpjs.parseShp(shpfile);
        let dbffileContents = shpjs.parseDbf(dbffile);
        let shp2geoContents = shpjs.combine([shpfileContents, dbffileContents]);
        console.log("test", shp2geoContents);

        let top = topoServer.topology({foo: shp2geoContents});
        let top2 = topoSimplify.presimplify(top);
        let top3 = topoSimplify.simplify(top2, .005);
        let feature = topoClient.feature(top3, "foo");
        console.log("test2", feature);

console.log("feature", feature);
var mapOptions = {
    center: [0, 0],
    zoom: 1,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      })
    ]
  };
  var map = new L.Map(document.createElement('div'), mapOptions);
  
  // Create a new L.GeoJSON instance and add it to the map
  var geojsonLayer = L.geoJSON(feature);
  geojsonLayer.addTo(map);
  
  // Get the bounds of the GeoJSON layer
  var bounds = geojsonLayer.getBounds();
  
  // Generate the thumbnail image using leafletImage
  leafletImage(map, function(err, canvas) {
    if (err) {
      console.error(err);
      return;
    }
    // Convert the canvas to a data URI and display it
    var thumbnailDataUri = canvas.toDataURL();
    console.log(thumbnailDataUri);
  });
  
  // Remove the GeoJSON layer from the map
  geojsonLayer.remove();

// Remove the GeoJSON layer from the map
map.removeLayer(geojsonLayer);

        const response = await api.createNewMap({ map: feature });
        console.log("createNewMap response: " + response);
        if (response.status === 201) {
            //tps.clearAllTransactions();
            let newMap = response.data.map;
            console.log("newmap", newMap);
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_MAP,
                payload: newMap
            });

            navigate("/createmap");
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.createNewMapGeoJson = async function (geojsonfile) {
        let textDecoder = new TextDecoder("utf-8");
        let jsonString = textDecoder.decode(geojsonfile);
        let featureCollection = JSON.parse(jsonString);
        console.log("featurecollection", featureCollection);

        let top = topoServer.topology({foo: featureCollection});
        let top2 = topoSimplify.presimplify(top);
        let top3 = topoSimplify.simplify(top2, .005);
        let feature = topoClient.feature(top3, "foo");

        const response = await api.createNewMap({ map: feature });
        console.log("createNewMap response: " + response);
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
    }

    store.updateMapCustomProperties = async function (name, keywords, collaborators) {
        let keywordsArray = keywords.split(/[\s,]+/);
        // let collaboratorsArray = collaborators.split((/[\s,]+/))
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
            navigate("/createmap");
        }
    }

    store.duplicateMapById = async function (id) {
        const response = await api.duplicateMapById({ id: id });
        if (response.status === 201) {
            store.loadUserMapsNoGeoJson();
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
            console.log(response.data.currentMap);
            const map = response.data.currentMap;
            const json = JSON.stringify(map.geoJsonMap);
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
        const response = await api.getMapById(store.mapIdMarkedForExport);
        if (response.status === 201) {
            const map = response.data.currentMap;

            // shpjs.zip(map.geoJsonMap).then(function(content) {
            //     // content is a Blob containing the zipped shapefile
            //     // Do something with the shapefile, such as download it
            //     saveAs(content, 'myshapefile.zip');
            //   });

        }
    }

    store.addPolygonToMap = async function (feature) {
        const response = await api.addPolygonToMap(store.currentMap._id, feature);
        if (response.status === 201) {
            console.log("success");
            const map = response.data.map;
            console.log(map.geoJsonMap.features.length);
        }
    }
    store.updatePolygonOfMap = async function (prevPolygon, updatedPolygon) {
        const response = await api.updatePolygonOfMap(store.currentMap._id, prevPolygon, updatedPolygon);
        if (response.status === 201) {
            console.log("success");
            const map = response.data.map;
            console.log(map.geoJsonMap.features.length);
        }
    }

    store.deletePolygonOfMap = async function (feature) {
        const response = await api.deletePolygonOfMap(store.currentMap._id, feature);
        if (response.status === 201) {
            console.log("ww");
            const map = response.data.map;
            console.log(map.geoJsonMap.features.length);
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