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
 //baseURL: "https://shapershifter.onrender.com"
  //baseURL: "http://localhost:5000"
});

export const getLoggedIn = () => api.get(`/auth/loggedIn`);
export const signup = (payload) => api.post(`/auth/signup`, payload);
export const login = (payload) => api.post(`/auth/login`, payload);
export const logout = () => api.get(`/auth/logout`);
export const forgotPassword = (payload) =>
  api.get(`/auth/forgotpassword?email=${payload}`);
export const verifyPassword = (email, token) =>
  api.get(`/auth/verifypassword?email=${email}&token=${token}`);
export const updatePassword = (payload) =>
  api.put(`/auth/updatepassword`, payload);

const apis = {
  getLoggedIn,
  signup,
  login,
  logout,
  forgotPassword,
  verifyPassword,
  updatePassword,
};

export default apis;
