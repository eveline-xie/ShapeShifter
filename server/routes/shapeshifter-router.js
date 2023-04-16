const auth = require("../auth");
const express = require("express");
const UserController = require("../controllers/user-controller");
const router = express.Router();

router.get("/auth/loggedIn", UserController.getLoggedIn);
router.post("/auth/signup", UserController.signup);
router.post("/auth/login", UserController.login);
router.get("/auth/forgotpassword", UserController.forgotPassword);
router.get("/auth/logout", UserController.logout);


module.exports = router;