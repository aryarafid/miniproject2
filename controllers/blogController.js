const axios = require("axios");
const db = require("../models");
const { Blog, Country } = db;
// const country = db.Country;
const user = db.User;
const sequelize = db.Sequelize;
const { Op } = sequelize;

const blogController = {
  // related to country
  getAllCountry: async (req, res) => {
    try {
      const result = await Country.findAll();
      return res.status(200).json({
        message: "Get data success",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get data failed",
        error: error.message,
      });
    }
  },

  getCountryById: async (req, res) => {
    try {
      // ambil id dari parameter path url
      const { id } = req.query;

      // return res.send(id);

      // select * from branches b, users u where b.id = u.id
      const result = await Country.findOne({
        where: {
          id,
        },
        // eager loading
      });

      return res.status(200).json({
        message: "Get data success",
        data: result,
      });
    } catch (err) {
      // return function if fail or error
      return res.status(500).json({
        message: "Get data failed",
        error: err.message,
      });
    }
  },

  getAllBlog: async (req, res) => {
    try {
      const result = await Blog.findAndCountAll({
        limit: 10,
        // offset: 8,
        where: {
          isPublished: { [Op.eq]: 1 },
          isDeleted: { [Op.eq]: 0 },
        },
        order: [
          ["createdAt", "DESC"],
          ["title", "ASC"]
        ],
      });
      return res.status(200).json({
        message: "Get data success",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get data failed",
        error: error.message,
      });
    }
  },
};

module.exports = blogController;
