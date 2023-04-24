/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
*/

import axios from "axios";
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "https://shapeshifter-api.onrender.com"
   //baseURL: "http://localhost:5000"
});

export const createNewMap = (payload) => {
    return api.post('/map', payload);
}

export const updateMapCustomProperties = (id, payload) => {
  return api.put('/update-map-props', {
    id: id,
    payload : payload
  });
}

export const loadUserMaps = () => {
  return api.get('/load-user-maps');
}

export const loadUserMapsNoGeoJson = () => {
  return api.get('/load-user-maps-no-geojson');
}

export const getMapById = (id) => {
  return api.get(`/map/${id}`);
}

export const duplicateMapById = (id) => {
  return api.post('/duplicate-map', id);
}

export const deleteMapById = (id) => {
  return api.delete(`/map/${id}`);
}

export const addPolygonToMap = (id, feature) => {
  return api.put(`/map/${id}`, {
    feature: feature
  })
}

export const updatePolygonOfMap = (id, prevPolygon ,updatedPolygon) => {
  return api.put(`/update-polygon-of-map/${id}`, {
    prevPolygon: prevPolygon,
    updatedPolygon: updatedPolygon
  })
}

export const deletePolygonOfMap = (id, feature) => {
  return api.put(`/delete-polygon-of-map/${id}`, {
    feature: feature
  })
}

const apis = {
  createNewMap,
  updateMapCustomProperties,
  loadUserMaps,
  loadUserMapsNoGeoJson,
  getMapById,
  duplicateMapById,
  deleteMapById,
  addPolygonToMap,
  updatePolygonOfMap,
  deletePolygonOfMap
};

export default apis;