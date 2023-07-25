const {
  authController,
  blogController,
  profileController,
  changeEmail,
  changePassword,
  changePhone,
  changePhoto,
  changeUsername,
} = require("../controllers");

const {
  authValidator,
  validateRegistration,
  validatePassword,
  validateChangePassword,
  validateChangeUsername,
} = require("../middleware/authValidator");
const { multerUpload } = require("../middleware/multer");

const router = require("express").Router();

// register -> /register
router.post(
  "/register",
  validateRegistration,
  authValidator.inputValidator,
  authController.register
);
// verify
router.patch("/verify/:token", authController.verify);
// login
router.post(
  "/login",
  validatePassword,
  authValidator.inputValidator,
  authController.login
);
// change pw
router.patch(
  "/change-password",
  validateChangePassword,
  authValidator.inputValidator,
  authValidator.verifyToken,
  changePassword
);
// change uname
router.patch(
  "/change-username",
  validateChangeUsername,
  authValidator.inputValidator,
  authValidator.verifyToken,
  changeUsername
);
// change phone number
router.patch("/change-phone", authValidator.verifyToken, changePhone);
//change email
router.patch("/change-email", authValidator.verifyToken, changeEmail);
// change avatar
router.post(
  "/change-photo",
  authValidator.verifyToken,
  multerUpload.single('avatar'),
  changePhoto
);

module.exports = router;
