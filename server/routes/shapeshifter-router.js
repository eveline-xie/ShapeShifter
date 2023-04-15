const auth = require("../auth");
const express = require("express");
const UserController = require("../controllers/user-controller");
const router = express.Router();

router.post("/auth/signup", UserController.signup);

module.exports = router;