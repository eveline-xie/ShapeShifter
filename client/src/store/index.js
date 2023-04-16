import { createContext, useContext, useState } from 'react'
// import jsTPS from '../common/jsTPS'
// import api from './store-request-api'
// import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
// import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
// import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
// import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
// import AuthContext from '../auth'
import { Global } from '@emotion/react'
import shpjs from 'shpjs';

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CREATE_NEW_MAP_SHPDBF: "CREATE_NEW_MAP_SHPDBF",
    CREATE_NEW_MAP_GEOJSON: "CREATE_NEW_MAP_GEOJSON"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        newShpFile: null,
        newDbfFile: null,
        newGeoJsonFile: null,
    })


    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CREATE_NEW_MAP_SHPDBF: {
                return setStore({
                    newShpFile: payload.shpfile,
                    newDbfFile: payload.dbffile,
                    newGeoJsonFile: null
                })
            }
            case GlobalStoreActionType.CREATE_NEW_MAP_GEOJSON: {
                return setStore({
                    newShpFile: null,
                    newDbfFile: null,
                    newGeoJsonFile : payload
                })
            }
        }
    }

    store.createNewMapSHPDBF = function (shpfile, dbffile) {

        let shpfileContents = shpjs.parseShp(shpfile);
        let dbffileContents = shpjs.parseDbf(dbffile);
        let shp2geoContents = shpjs.combine([shpfileContents, dbffileContents]);
        console.log("newstuff", shp2geoContents);

        storeReducer({
            type: GlobalStoreActionType.CREATE_NEW_MAP,
            payload: {
                shpfile: shpfile,
                dbffile: dbffile
            }
        })
    }

    store.createNewMapGeoJson = function (geojsonfile) {
        storeReducer({
            type: GlobalStoreActionType.CREATE_NEW_MAP,
            payload: geojsonfile
        })
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