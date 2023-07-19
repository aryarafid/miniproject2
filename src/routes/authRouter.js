const { authController } = require("../controllers");
const router = require("express").Router();

// register -> /register
router.post("/register", authController.register);

module.exports = router;
