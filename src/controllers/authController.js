const axios = require("axios");
const db = require("../models");
const user = db.User;
const sequelize = db.Sequelize;
const { Op } = sequelize;

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      return res.send(req.body);



      
    } catch (error) {
      return res.status(500).json({
        message: "Register failed",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
