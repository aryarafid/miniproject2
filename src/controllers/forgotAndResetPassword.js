const db = require("../models");
const user = db.User;
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const userFind = await user.findByPk(req.user.id); // Fetch acc data from the database based on user ID
    if (!userFind) {
      return res.status(404).json({ message: "User not found." });
    }
    if (userFind.email !== email) {
      return res
        .status(404)
        .json({ message: "Email does not exist in the database." });
    }
    //send email

    return res.status(200).json({
      message: " Change password succeed",
      // data: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed",
      error: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const userFind = await user.findByPk(req.user.id); // Fetch password from the database based on user ID
    if (!userFind) {
      return res.status(404).json({ message: "User not found." });
    }
    const isValid = await bcrypt.compare(currentPassword, userFind.password); //compare old password input with the one in database
    if (!isValid) {
      return res.status(404).json({
        message: "password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10); // begin processing the password change. now we hash the new password
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await db.sequelize.transaction(async (t) => {
      userFind.password = hashPassword; // Set the new password
      await userFind.save({ transaction: t }); // Save the user with the updated password
      return res.status(200).json({
        message: " Change password succeed",
        // data: result,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed",
      error: err.message,
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
