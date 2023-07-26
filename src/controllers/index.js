const authController = require("./authController");
const blogController = require("./blogController");
const profileController = require("./profileController");

const { changeEmail } = require("./changeEmail");
const { changePassword } = require("./changePassword");
const { changePhone } = require("./changePhone");
const { changePhoto } = require("./changePhoto");
const { changeUsername } = require("./changeUsername");
const { forgotPassword, resetPassword } = require("./forgotAndResetPassword");

module.exports = {
  authController,
  blogController,
  profileController,
  changeEmail,
  changePassword,
  changePhone,
  changePhoto,
  changeUsername,
  forgotPassword,
  resetPassword,
};
