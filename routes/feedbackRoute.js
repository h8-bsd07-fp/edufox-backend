const router = require("express").Router();
const authentication = require("../middleware/authentication");
const FeedbackController = require("../controllers/feedbackController");

router.post("/:courseId", authentication, FeedbackController.addFeedback);

module.exports = router;
