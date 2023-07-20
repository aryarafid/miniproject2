const { authController } = require("../controllers");
const { authValidator } = require("../middleware/authValidator");
const { body } = require("express-validator");

const router = require("express").Router();

const createRegVal = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/)
    .withMessage(
      "Password must have a minimum of 6 characters, 1 symbol, and 1 capital letter"
    ),
];

// register -> /register
router.post("/register", createRegVal, authValidator, authController.register);

module.exports = router;
