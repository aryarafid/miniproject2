const router = require("express").Router();
const { blogController } = require("../controllers");

// serve country
router.get("/getAllCountry", blogController.getAllCountry);
router.get("/getCountryById", blogController.getCountryById);

// blog
router.get("/getAllBlog", blogController.getAllBlog);

module.exports = router;
