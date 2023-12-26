const router = require("express").Router();
const authentication = require("../middleware/authentication");
const ChapterController = require("../controllers/chapterController");

router.get("/:chapterId", authentication, ChapterController.getChapterById);

module.exports = router;
