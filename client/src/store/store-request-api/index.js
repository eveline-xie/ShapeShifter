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
  //   baseURL: "https://shapeshifter-api.onrender.com",
  baseURL: "http://localhost:5000",
});

export const createMap = (payload) => {
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

export const getMapById = (id) => {
  return api.get(`/map/${id}`);
}

const apis = {
  createMap,
  updateMapCustomProperties,
  loadUserMaps,
  getMapById
};

export default apis;