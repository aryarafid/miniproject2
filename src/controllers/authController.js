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
      // cek user exist?
      const existingUser = await user.findOne({
        where: {
          [Op.or]: [{ email }, { username }, { phone }],
        },
      });
      if (existingUser) {
        return res.status(500).json({
          message: "Email / username / phone already exists.",
        });
      }
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      return res.json({hashPassword });
      // return res.send(hashPassword);

      const data = await fs.readFile(
        path.resolve(__dirname, "../emails/registerEmail.html"),
        "utf-8"
      );
    } catch (error) {
      return res.status(500).json({
        message: "Register failed",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
