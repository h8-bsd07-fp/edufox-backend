const router = require("express").Router();
const CourseController = require("../controllers/courseController");

router.get("/", CourseController.getAllCourse);
router.get("/:CourseId", CourseController.getCourseDetails);

module.exports = router;
