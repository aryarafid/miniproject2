const { authController } = require("../controllers");
const profileController = require("../controllers/profileController");
const {
  authValidator,
  validateRegistration,
  validatePassword,
  validateChangePassword,
  validateChangeUsername,
} = require("../middleware/authValidator");
// const { authValidator } = require("../middleware/authValidator");
const { body } = require("express-validator");

const router = require("express").Router();

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
  validatePassword,
  authValidator.inputValidator,
  authController.login
);
router.patch(
  "/change-password",
  validateChangePassword,
  authValidator.inputValidator,
  authValidator.verifyToken,
  profileController.changePassword
);

router.patch(
  "/change-username",
  validateChangeUsername,
  authValidator.inputValidator,
  authValidator.verifyToken,
  profileController.changeUsername
);

//l
router.patch(
  "/change-email",
  authValidator.verifyToken,
  profileController.changeEmail
);
router.patch(
  "/change-phone",
  authValidator.verifyToken,
  profileController.changePhone
);
router.post(
  "/change-photo",
  authValidator.verifyToken,
  profileController.changePhoto
);

module.exports = router;
