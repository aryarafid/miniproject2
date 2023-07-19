const axios = require("axios");
const db = require("../models");
const { Blog, Country } = db;
// const country = db.Country;
const user = db.User;
const sequelize = db.Sequelize;
const { Op } = sequelize;

const blogController = {
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
