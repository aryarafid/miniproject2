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
const path = require("path");
const { log } = require("console");
const { Op } = sequelize;
require("dotenv").config({
  path: path.resolve("../.env"),
});

const profileController = {
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      const userId = req.user.id; //get id from middleware
      const userFind = await user.findByPk(userId); // Fetch password from the database based on user ID
      // return res.json(userFind.password);

      if (!userFind) {
        return res.status(404).json({ message: "User not found." });
      }
      // compare old password input with the one in database
      const isValid = await bcrypt.compare(currentPassword, userFind.password);
      if (!isValid) {
        return res.status(404).json({
          message: "password is incorrect",
        });
      }
      // begin processing the password change. now we hash the new password
      const salt = await bcrypt.genSalt(10);
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
  },

  changeUsername: async (req, res) => {
    try {
      const { currentUsername, newUsername } = req.body;

      const { id } = req.user; //get id  from middleware
      const userFind = await user.findByPk(id); // Fetch password from the database based on user ID

      // compare current uname with the one in database
      if (currentUsername !== userFind.username) {
        return res.status(404).json({
          message: "current username is incorrect, try again",
        });
      }

      // compare current uname with the new one
      if (currentUsername === newUsername) {
        return res.status(404).json({
          message: "Current and new username cannot be the same",
        });
      }

      await db.sequelize.transaction(async (t) => {
        userFind.username = newUsername; // Set the new uname
        await userFind.save({ transaction: t }); // Save the user with the updated uname

        const templatePath = path.resolve(
          __dirname,
          "../emails/changeUserEmail.html"
        );
        const templateContent = await fs.readFile(templatePath, "utf-8");
        const template = handlebars.compile(templateContent);
        const rendered = template({ newUsername });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // Pengiriman email
        await transporter.sendMail({
          from: process.env.NODEMAIL_USER,
          to: userFind.email,
          subject: "Successfully changed username",
          html: rendered,
        });

        return res.status(200).json({
          message: " Change username succeed",
        });
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed",
        error: err.message,
      });
    }
  },

  changePhone: async (req, res) => {
    try {
      const { currentPhone, newPhone } = req.body;

      // const { id } = req.user; //get id  from middleware
      const userFind = await user.findByPk(req.user.id); // Fetch password from the database based on user ID
return res.json(userFind);

      // compare current uname with the one in database
      if (currentUsername !== userFind.username) {
        return res.status(404).json({
          message: "current username is incorrect, try again",
        });
      }

      // compare current uname with the new one
      if (currentUsername === newUsername) {
        return res.status(404).json({
          message: "Current and new username cannot be the same",
        });
      }

      await db.sequelize.transaction(async (t) => {
        userFind.username = newUsername; // Set the new uname
        await userFind.save({ transaction: t }); // Save the user with the updated uname

        const templatePath = path.resolve(
          __dirname,
          "../emails/changeUserEmail.html"
        );
        const templateContent = await fs.readFile(templatePath, "utf-8");
        const template = handlebars.compile(templateContent);
        const rendered = template({ newUsername });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // Pengiriman email
        await transporter.sendMail({
          from: process.env.NODEMAIL_USER,
          to: userFind.email,
          subject: "Successfully changed username",
          html: rendered,
        });

        return res.status(200).json({
          message: " Change username succeed",
        });
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed",
        error: err.message,
      });
    }
  },

  changeEmail: async (req, res) => {
    try {
      return res.json("change email");
    } catch (err) {
      return res.status(500).json({
        message: "Failed",
        error: err.message,
      });
    }
  },


  changePhoto: async (req, res) => {
    try {
      return res.json("change photo");
    } catch (err) {
      return res.status(500).json({
        message: "Failed",
        error: err.message,
      });
    }
  },
};

module.exports = profileController;
