const { authController } = require("../controllers");
const profileController = require("../controllers/profileController");
const { authValidator } = require("../middleware/authValidator");
// const { authValidator } = require("../middleware/authValidator");
const { body } = require("express-validator");

const router = require("express").Router();

const validateRegistration = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/)
    .withMessage(
      "Password must have a minimum of 6 characters, 1 symbol, and 1 capital letter"
    ),
];

const validateLogin = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/)
    .withMessage(
      "Password must have a minimum of 6 characters, 1 symbol, and 1 capital letter"
    ),
];

// register -> /register
router.post(
  "/register",
  validateRegistration,
  authValidator.inputValidator,
  authController.register
);
router.patch("/verify/:token", authController.verify);
router.post(
  "/login",
  validateLogin,
  authValidator.inputValidator,
  authController.login
);
router.patch(
  "/changeEmail",
  authValidator.verifyToken,
  profileController.changeEmail
);
router.patch(
  "/changeUsername",
  authValidator.verifyToken,
  profileController.changeUsername
);
router.patch(
  "/changePhone",
  authValidator.verifyToken,
  profileController.changePhone
);
router.post(
  "/changePhoto",
  authValidator.verifyToken,
  profileController.changePhoto
);

module.exports = router;
