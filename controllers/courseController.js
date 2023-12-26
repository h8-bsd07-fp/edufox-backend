const { Op } = require("sequelize");
const { Course, Chapter, Feedback, Category, User } = require("../models");

class CourseController {
  static async getAllCourse(req, res, next) {
    const { page, name, categoryId } = req.query;
    const limitPage = 8;
    const findName = name ? name : "";
    const pageStartPoint = page ? limitPage * (page - 1) : 0;

    const filterOptions = {
      name: {
        [Op.iLike]: `%${findName}%`,
      },
    };

    if (categoryId) {
      filterOptions.CategoryId = categoryId.split(",");
    }

    try {
      const result = await Course.findAndCountAll({
        where: filterOptions,
        limit: limitPage,
        offset: pageStartPoint,
        order: [["name", "ASC"]],
        include: [Category, Feedback]
      });

      res.status(200).json({
        statusCode: 200,
        currentPage: page || 1,
        data: result.rows,
        totalData: result.count,
        totalPage: Math.ceil(result.count / limitPage),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCourseDetails(req, res, next) {
    const { courseId } = req.params;
    try {
      const result = await Course.findByPk(courseId, {
        include: [
          {
            model: Chapter,
            // sort by chapterNo, ASC
            order: [["chapterNo", "ASC"]],
          },
          {
            model: Feedback,
            limit: 4,
            include: {
              model: User,
              attributes: ["username", "profilePicture"]
            },
            order: [["updatedAt", "DESC"]]
          },
          Category
        ],
      });
      if (!result) {
        throw new Error("DATA_NOT_FOUND");
      }
      // console.log(result);
      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CourseController;
