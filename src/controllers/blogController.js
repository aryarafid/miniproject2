const axios = require("axios");
const db = require("../models");
const blog = db.Blog;
const user = db.User;
const { Blog, Country, Category, User } = db;
const sequelize = db.Sequelize;
const { Op } = sequelize;

const blogController = {
  getBlog: async (req, res) => {
    try {
      const { page } = req.query;
      const result = await Blog.findAndCountAll({
        limit: 10,
        offset: page == null || page == 1 ? 0 : 10 * (page - 1),
        // where: {
        //   isPublished: { [Op.eq]: 1 },
        //   isDeleted: { [Op.eq]: 0 },
        // },
        order: [
          ["createdAt", "DESC"],
          ["title", "ASC"],
        ],
        include: [
          { model: Category },
          { model: Country },
          { model: User, attributes: ["id", "username", "email", "phone"] },
        ],
      });
      return res.status(200).json({
        message: "Get data success",
        page: page == null || page == 1 ? 1 : page,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get data failed",
        error: error.message,
      });
    }
  },

  searchBlog: async (req, res) => {
    try {
      const { cat, title, sort } = req.query;
      const whereClause = {};
      if (cat) {
        whereClause.categoryId = { [Op.eq]: cat };
      }
      if (title) {
        whereClause.title = { [Op.like]: `%${title}%` };
      }
      const orderClause = [["createdAt", sort || "DESC"]];
      const result = await Blog.findAndCountAll({
        where: whereClause,
        order: orderClause,
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

  // createblog
  createBlog: async (req, res) => {
    try {
      const {
        title,
        imageURL,
        categoryId,
        content,
        videoURL,
        keyword,
        countryId,
      } = req.query;

      // const userFind = await user.findByPk(req.user.id);

      // user ID get from token
      // Use a transaction to ensure atomicity
      await db.sequelize.transaction(async (t) => {
        // Create the blog post within the transaction
        const blogCreate = await blog.create(
          {
            title,
            userId: req.user.id,
            imageURL,
            categoryId,
            content,
            videoURL,
            keyword,
            countryId,
          },
          { transaction: t }
        );

        return res.status(200).json({
          message: " Change phone number succeed",
          blogCreate,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Create blog failed. Try again",
        error: error.message,
      });
    }
  },
};

module.exports = blogController;
