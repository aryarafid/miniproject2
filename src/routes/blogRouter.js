const router = require("express").Router();
const { blogController } = require("../controllers");
const {
  authValidator,
  validateWriteBlog,
} = require("../middleware/authValidator");

// get all blog
router.get("/get-all", blogController.getBlog);
// search blog
router.get("/search", blogController.searchBlog);
// create blog
router.post(
  "/create",
  validateWriteBlog,
  authValidator.inputValidator,
  authValidator.verifyToken,
  blogController.createBlog
);

module.exports = router;
