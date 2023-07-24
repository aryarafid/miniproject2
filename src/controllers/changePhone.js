const db = require("../models");
const user = db.User;
const fs = require("fs").promises;
const handlebars = require("handlebars");
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/transporter");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});

const changePhone = async (req, res) => {
  try {
    const { currentPhone, newPhone } = req.body;

    const userFind = await user.findByPk(req.user.id); // Fetch phone from the database based on user ID

    // compare current phone with the one in database
    if (currentPhone !== userFind.phone) {
      return res.status(404).json({
        message: "current phone number input is incorrect, try again",
      });
    }

    // compare current phone with the new one
    if (currentPhone === newPhone) {
      return res.status(404).json({
        message: "Current and new phone number input cannot be the same",
      });
    }

    await db.sequelize.transaction(async (t) => {
      userFind.phone = newPhone; // Set the new uname
      await userFind.save({ transaction: t }); // Save the user with the updated uname

      const templatePath = path.resolve(
        __dirname,
        "../emails/changePhoneEmail.html"
      );
      const templateContent = await fs.readFile(templatePath, "utf-8");
      const template = handlebars.compile(templateContent);
      const rendered = template({ newPhone });

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
        subject: "Successfully changed phone number",
        html: rendered,
      });

      return res.status(200).json({
        message: " Change phone number succeed",
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
  changePhone,
};
