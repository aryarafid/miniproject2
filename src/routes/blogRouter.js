const router = require("express").Router();
const { blogController } = require("../controllers");
const {
  authValidator,
  validateWriteBlog,
} = require("../middleware/authValidator");
const { multerUpload } = require("../middleware/multer");

// get all country
router.get("/get-country", blogController.getCountry);
// get all country
router.get("/get-category", blogController.getCategory);

// get all blog
router.get("/get-all", blogController.getBlog);
// search blog
router.get("/search", blogController.searchBlog);
// create blog
router.post(
  "/create",
  // validateWriteBlog, --> error
  // authValidator.inputValidator,
  authValidator.verifyToken,
  multerUpload.single("imageURL"),
  blogController.createBlog
);

module.exports = router;
