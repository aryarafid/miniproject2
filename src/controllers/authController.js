const axios = require("axios");
const db = require("../models");
const user = db.User;
const sequelize = db.Sequelize;
const fs = require("fs").promises;
const handlebars = require("handlebars");
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/transporter");
const bcrypt = require("bcrypt");
const path = require("path");
const { log } = require("console");
const { Op } = sequelize;

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      const isEmailExist = await user.findOne({
        where: {
          email,
        },
      });
      const isUnameExist = await user.findOne({
        where: {
          username,
        },
      });
      const isPhoneExist = await user.findOne({
        where: {
          phone,
        },
      });
      // return res.send(isEmailExist);
      if (isEmailExist) {
        return res.status(500).json({
          message: "Email Already Exists",
        });
      } else if (isUnameExist) {
        return res.status(500).json({
          message: "username Already Exists",
        });
      } else if (isPhoneExist) {
        return res.status(500).json({
          message: "Phone Already Exists",
        });
      }
      // coolcool
      // const existingUser = await user.findOne({
      //   where: {
      //     [Op.or]: [{ email }, { username }, { phone }],
      //   },
      // });
      // // return res.send(existingUser);
      // if (existingUser) {
      //   return res.status(500).json({
      //     message: "Email / username / phone already exists.",
      //   });
      // }

      const data = await fs.readFile(
        path.resolve(__dirname, "../emails/registerEmail.html"),
        "utf-8"
      );
      const tempCompile = await handlebars.compile(data);
      log(token);
      const tempResult = tempCompile({ token });

      return res.send(tempResult);
    } catch (error) {
      return res.status(500).json({
        message: "Register failed",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
