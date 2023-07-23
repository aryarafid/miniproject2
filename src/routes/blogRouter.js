const router = require("express").Router();
const { blogController } = require("../controllers");
const { authController } = require("../controllers");
const { authValidator } = require("../middleware/authValidator");
const { body } = require("express-validator");

// blog
router.get("/getBlog", blogController.getBlog);
router.get("/searchBlog", blogController.searchBlog);
router.post(
  "/createBlog",
  authValidator.verifyToken,
  blogController.createBlog
);

module.exports = router;
