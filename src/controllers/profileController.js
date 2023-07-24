const db = require("../models");
const user = db.User;
const sequelize = db.Sequelize;
const fs = require("fs").promises;
const handlebars = require("handlebars");
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/transporter");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});

const profileController = {};

module.exports = profileController;
