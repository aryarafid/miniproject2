const router = require("express").Router();
const { blogController } = require("../controllers");

// blog
router.get("/getBlog", blogController.getBlog);
router.get("/searchBlog", blogController.searchBlog);

module.exports = router;
