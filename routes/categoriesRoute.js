const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");

router.get("/", CategoryController.getAllCategory);
// router.get("/:categoryId", CategoryController.getCategoryCourse);

module.exports = router;
