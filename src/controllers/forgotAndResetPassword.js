const db = require("../models");
const user = db.User;
const sequelize = db.Sequelize;
const fs = require("fs").promises;
const handlebars = require("handlebars");
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/transporter");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { Op } = sequelize;
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const userFind = await user.findOne({
      where: { email: email },
      // Only retrieve the 'id' attribute
    });
    //from the database based on user ID
    if (!userFind) {
      return res.status(404).json({ message: "User not found." });
    }
    if (userFind.email !== email) {
      return res
        .status(404)
        .json({ message: "Email does not exist in the database." });
    }
    //create token and send it to email. token is filled with id and email. token is used for resetting the pw
    let payload = { id: userFind.id, email: userFind.email };
    // return res.json(payload);
    const token = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: 600000,
    });

    const redirect = `http://localhost:3000/api/auth/reset-password/${token}`;

    const templatePath = path.resolve(
      __dirname,
      "../emails/resetPassword.html"
    );
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const template = handlebars.compile(templateContent);
    const rendered = template({ redirect });

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
      from: process.env.NODEMAILER_USER,
      to: userFind.email,
      subject: "Forgot Password",
      html: rendered,
    });

    return res.status(200).json({
      message: "Email sent",
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
    const token = req.params.token;
    const { newPassword, confirmPassword } = req.body;
    const verifier = process.env.JWT_KEY;
    const decode = jwt.verify(token, verifier);
    // return res.json(decode);
    if (!decode) {
      return res.status(404).send("token invalid");
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(404)
        .send("new password and confirm password input have to be the same");
    }
    // hash pw
    const salt = await bcrypt.genSalt(10);
    const password1 = await bcrypt.hash(newPassword, salt);
    // return res.json(password1);
    await db.sequelize.transaction(async (t) => {
      await user.update(
        { password: password1 },
        {
          where: {
            id: decode.id,
          },
        },
        { transaction: t }
      );

      return res.status(200).json({
        message: "reset password succeed",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "reset password failed",
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
