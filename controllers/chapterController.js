const { Chapter } = require("../models/index");

class ChapterController {
  static async getChapterById(req, res, next) {
    const { chapterId } = req.params;
    try {
      // console.log("testingggg");
      const result = await Chapter.findByPk(chapterId);

      if (!result) {
        throw new Error("DATA_NOT_FOUND");
      }

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ChapterController;
