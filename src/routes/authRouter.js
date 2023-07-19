const router = require("express").Router();
const { authController } = require("../controllers");

// test
router.get("/", authController.welcome);

// register -> /register
// router.get("/register", register);

//verify

// login -> /login
// router.get("/login", login);

// keep login ->

// forgot password ->

// reset  password ->

// change password ->

// change username ->

// change phone ->

// change email ->

module.exports = router;
