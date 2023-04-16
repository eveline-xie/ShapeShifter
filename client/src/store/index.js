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

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CREATE_NEW_MAP_SHPDBF: "CREATE_NEW_MAP_SHPDBF",
    CREATE_NEW_MAP_GEOJSON: "CREATE_NEW_MAP_GEOJSON"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentMap: null
    })

    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CREATE_NEW_MAP: {
                return setStore({
                    currentMap: payload
                })
            }
        }
    }

    store.createNewMapSHPDBF = async function (shpfile, dbffile) {

        let shpfileContents = shpjs.parseShp(shpfile);
        let dbffileContents = shpjs.parseDbf(dbffile);
        let shp2geoContents = shpjs.combine([shpfileContents, dbffileContents]);
        console.log("featurecollection", shp2geoContents);

        const sizeInBytes = JSON.stringify(shp2geoContents).length;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        console.log(`Object size is approximately ${sizeInMB.toFixed(2)} MB`);
        
        //const response = await api.createMap({map: shp2geoContents});
        const response = await api.createMap({map: "mapcontents"});
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

        //const response = await api.createMap(featureCollection);
        const response = await api.createMap({map: "mapcontents"});
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
        let collaboratorsArray = collaborators.split((/[\s,]+/))
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
            console.log("hi", newMap);
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