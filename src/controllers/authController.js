const axios = require("axios");
const db = require("../models");
const user = db.User;
const sequelize = db.Sequelize;
const fs = require("fs").promises;
const handlebars = require("handlebars");
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/transporter");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { log } = require("console");
const { Op } = sequelize;
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});

const sender_email = "nfsmwblackedition11@gmail.com";
const sender_pw = "otzjaxmjcplkaaje";

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
      // return res.json({hashPassword });

      await db.sequelize.transaction(async (t) => {
        const result = await user.create(
          {
            username,
            email,
            phone,
            password: hashPassword,
          },
          { transaction: t }
        );
        let payload = { id: result.id };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: "1h",
        });

        const redirect = `http://localhost:3000/api/auth/verify/${token}`;

        const templatePath = path.resolve(
          __dirname,
          "../emails/registerEmail.html"
        );
        const templateContent = await fs.readFile(templatePath, "utf-8");
        const template = handlebars.compile(templateContent);
        const rendered = template({ redirect });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: sender_email,
            pass: sender_pw,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // Pengiriman email
        await transporter.sendMail({
          // from: process.env.NODEMAIL_USER,
          from: sender_email,
          to: result.email,
          subject: "Account Verification",
          html: rendered,
        });
        return res.status(200).json({
          message: " Registration Succeed. Check your email to verify",
          data: result,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Registration failed",
        error: error.message,
      });
    }
  },

  verify: async (req, res) => {
    // get token, confirm identity, give button to turn isverified to yes
    const token = req.params.token;
    try {
      const verifier = process.env.JWT_KEY;
      const decode = jwt.verify(token, verifier);
      // return res.json(decode);
      if (!decode) {
        return res.status(404).send("token invalid");
      }

      await db.sequelize.transaction(async (t) => {
        await user.update(
          { isVerified: true },
          {
            where: {
              id: decode.id,
            },
          },
          { transaction: t }
        );

        return res.status(200).json({
          message: "verification succeed. Welcome to the blog",
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "verification failed",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      // cek user exist?
      const checkLogin = await user.findOne({
        where: {
          [Op.or]: [{ email }, { username }, { phone }],
        },
      });

      if (!checkLogin) {
        return res.status(404).json({
          message:
            "seems like that email / username / phone is not registered here. please try again",
        });
      }

      const isValid = await bcrypt.compare(password, checkLogin.password);
      if (!isValid) {
        return res.status(404).json({
          message: "password is incorrect",
        });
      }

      let payload = {
        id: checkLogin.id,
        email: checkLogin.email,
        phone: checkLogin.phone,
        username: checkLogin.username,
        isVerified: checkLogin.isVerified,
      };

      const token = jwt.sign(payload, process.env.JWT_Key, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Login success",
        token: token,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Login failed",
        error: err.message,
      });
    }
  },
};

module.exports = authController;
