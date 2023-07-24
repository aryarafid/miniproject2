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

const changeEmail = async (req, res) => {
  try {
    const { currentEmail, newEmail } = req.body;

    const userFind = await user.findByPk(req.user.id); // Fetch phone from the database based on user ID

    // compare current phone with the one in database
    if (currentEmail !== userFind.email) {
      return res.status(404).json({
        message: "current email input is incorrect, try again",
      });
    }

    // compare current phone with the new one
    if (currentEmail === newEmail) {
      return res.status(404).json({
        message: "Current and new email input cannot be the same",
      });
    }

    await db.sequelize.transaction(async (t) => {
      userFind.email = newEmail; // Set the new uname
      userFind.isVerified = false;
      await userFind.save({ transaction: t }); // Save the user with the updated uname

      let payload = { id: userFind.id };
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
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Pengiriman email
      await transporter.sendMail({
        // from: process.env.NODEMAIL_USER,
        from: process.env.NODEMAILER_USER,
        to: userFind.email,
        subject: "Account Verification",
        html: rendered,
      });
      return res.status(200).json({
        message: " Registration Succeed. Check the new email to verify",
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
  changeEmail,
};
