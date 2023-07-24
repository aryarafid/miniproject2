const router = require("express").Router();
const { blogController } = require("../controllers");
const { authController } = require("../controllers");
const { authValidator } = require("../middleware/authValidator");
const { body } = require("express-validator");

// blog
router.get("/get-all", blogController.getBlog);
router.get("/search", blogController.searchBlog);
router.post(
  "/create",
  authValidator.verifyToken,
  blogController.createBlog
);

module.exports = router;
