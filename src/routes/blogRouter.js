const router = require("express").Router();
const { blogController } = require("../controllers");
const { authValidator } = require("../middleware/authValidator");

// get all blog
router.get("/get-all", blogController.getBlog);
// search blog
router.get("/search", blogController.searchBlog);
// create blog
router.post("/create", authValidator.verifyToken, blogController.createBlog);

module.exports = router;
