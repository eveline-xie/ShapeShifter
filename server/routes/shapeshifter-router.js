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

router.post("/map", auth.verify, MapController.createNewMap);
router.put("/update-map-props", auth.verify, MapController.updateMapCustomProperties);
router.get("/load-user-maps", auth.verify, MapController.loadUserMaps);
router.get("/map/:id", auth.verify, MapController.getMapById);
router.post("/duplicate-map", auth.verify, MapController.duplicateMapById);
router.delete("/map/:id", auth.verify, MapController.deleteMapById);


module.exports = router;