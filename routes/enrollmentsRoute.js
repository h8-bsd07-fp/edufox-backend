const router = require("express").Router();
const EnrollmentController = require("../controllers/enrollmentController");
const authentication = require("../middleware/authentication");

router.get("/", authentication, EnrollmentController.getAllEnrollment);
router.post("/:courseId", authentication, EnrollmentController.addEnrollment);
router.get(
  "/:courseId",
  authentication,
  EnrollmentController.getEnrollmentCourse
);
router.patch(
  "/:courseId",
  authentication,
  EnrollmentController.updateEnrollment
);

module.exports = router;
