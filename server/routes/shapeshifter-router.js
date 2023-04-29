const auth = require("../auth");
const express = require("express");
const UserController = require("../controllers/user-controller");
const MapController = require("../controllers/map-controller");
const router = express.Router();

router.get("/auth/loggedIn", UserController.getLoggedIn);
router.post("/auth/signup", UserController.signup);
router.post("/auth/login", UserController.login);
router.get("/auth/forgotpassword", UserController.forgotPassword);
router.get("/auth/logout", UserController.logout);
router.get("/auth/verifypassword", UserController.verifyPassword);
router.put("/auth/updatepassword", UserController.updatePassword);
router.get("/auth/user", UserController.getUserByEmail);



router.post("/map", auth.verify, MapController.createNewMap);
router.put("/update-map-props", auth.verify, MapController.updateMapCustomProperties);
router.get("/load-user-maps", auth.verify, MapController.loadUserMaps);
router.get("/load-user-maps-no-geojson", auth.verify, MapController.loadUserMapsNoGeoJson);
router.get("/map/:id", auth.verify, MapController.getMapById);
router.post("/duplicate-map", auth.verify, MapController.duplicateMapById);
router.delete("/map/:id", auth.verify, MapController.deleteMapById);
router.put("/map/:id", auth.verify, MapController.addPolygonToMap);
router.put("/update-polygon-of-map/:id", auth.verify, MapController.updatePolygonOfMap);
router.put("/delete-polygon-of-map/:id", auth.verify, MapController.deletePolygonOfMap);
router.put("/publish-map", auth.verify, MapController.publishMap);
module.exports = router;