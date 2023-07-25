const db = require("../models");
const user = db.User;
const bcrypt = require("bcrypt");
const path = require("path");

const fs = require("fs").promises;
require("dotenv").config({
  path: path.resolve("../.env"),
});

const changePhoto = async (req, res) => {
  try {
    const { id } = req.user;
    await db.sequelize.transaction(async (t) => {
      const oldData = await user.findOne({ where: { id } });
      const result = await user.update(
        {
          img_url: req.file.path,
        },
        { where: { id } },
        { transaction: t }
      );
      if (!result) {
        return res.status(500).json({
          message: "Change avatar failed",
          error: err.message,
        });
      }
      fs.unlink(oldData.img_url, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Old avatar deleted successfully");
      });
      return res.status(200).json({
        message: "Change avatar Success",
        image: req.file.path,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Change avatar failed",
      error: err.message,
    });
  }
};

module.exports = {
  changePhoto,
};
