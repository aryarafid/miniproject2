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

  changeUsername: async (req, res) => {
    try {
      return res.json("change uname");
    } catch (err) {
      return res.status(500).json({
        message: "Failed",
        error: err.message,
      });
    }
  },

  changePhone: async (req, res) => {
    try {
      return res.json("change phone");
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
