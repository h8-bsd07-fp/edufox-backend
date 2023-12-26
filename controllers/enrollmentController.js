const { Op } = require("sequelize");
const { Enrollment, Course, Chapter, Category } = require("../models/index");
const enrollment = require("../models/enrollment");

class EnrollmentController {
  static async getAllEnrollment(req, res, next) {
    const { userId } = req.user;
    const { page } = req.query;
    // let findName = "";

    const limitPage = 4;
    const pageStartPoint = page ? limitPage * (page - 1) : 0;

    // if (name) {
    //   findName = name;
    // }

    // if (page) {
    //   pageStartPoint = limitPage * (page - 1);
    // }
    try {
      const result = await Enrollment.findAndCountAll({
        where: {
          UserId: userId,
        },
        limit: limitPage,
        offset: pageStartPoint,
        include: [{
          model: Course,
          include: [
            Category,
            Chapter
          ]
        }, Chapter],
        order: [["updatedAt", "DESC"]], // createdAt DESC
      });
      //   const result = await Enrollment.findAll();

      const totalData = result.count / 3

      res.status(201).json({
        statusCode: 201,
        currentPage: page || 1,
        data: result.rows,
        totalData,
        totalPage: Math.ceil(totalData / limitPage),
      });
    } catch (err) {
      // console.log(err);
      next(err);
    }
  }

  static async getEnrollmentCourse(req, res, next) {
    const { courseId } = req.params;
    const { userId } = req.user;
    try {
      //   const result = await Course.findByPk(CourseId, {
      //     include: [
      //       {
      //         model: Chapter,
      //         include: Enrollment,
      //       },
      //     ],
      //   });
      const result = await Enrollment.findOne({
        where: {
          CourseId: courseId,
          UserId: userId,
        },
        include: {
          model: Course,
          include: {
            model: Chapter,
            order: [["chapterNo", "ASC"]],
            // sort by chapterNo ASC
          },
        },
      });

      if (!result) {
        throw new Error("DATA_NOT_FOUND");
      }

      //   console.log(result);

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addEnrollment(req, res, next) {
    const { courseId } = req.params;
    const { userId, userPremium } = req.user;
    try {
      console.log(courseId)

      // const checkUser = await User.findByPk(userId); // ini dari auth
      const checkCourse = await Course.findByPk(courseId);
      //   console.log(checkUser, 37);
      // console.log(checkCourse, 38);
      //   console.log(checkUser.isPremium, 39);
      //   console.log(checkCourse.isPremium, 40);
      if (checkCourse.isPremium === true && userPremium === false) {
        throw new Error("DONT_AUTHORIZED");
      }
      const findEnroll = await Enrollment.findOne({
        where: {
          CourseId: courseId,
          UserId: userId,
        },
      });

      // console.log(findEnroll);

      if (findEnroll) {
        throw new Error("ALREADY_EXISTS");
      }

      const findChapter = await Chapter.findOne({
        where: {
          CourseId: courseId,
          chapterNo: 1,
        },
      });
      // console.log(findChapter);
      // console.log(findChapter.id, 42);

      const result = await Enrollment.create({
        UserId: userId,
        CourseId: courseId,
        curChapterId: findChapter.id,
      });

      res.status(201).json({
        statusCode: 201,
        data: result,
      });
    } catch (err) {
      //   console.log(err);
      next(err);
    }
  }

  static async updateEnrollment(req, res, next) {
    const { courseId } = req.params;
    const { status, curChapterId } = req.body;
    const { userId } = req.user;
    try {
      const checkEnroll = await Enrollment.findOne({
        where: {
          CourseId: courseId,
          UserId: userId,
        },
      });

      if (!checkEnroll) {
        throw new Error("DATA_NOT_FOUND");
      }

      const result = await Enrollment.update(
        {
          status,
          curChapterId,
        },
        {
          where: {
            CourseId: courseId,
          },
        }
      );

      res.status(201).json({
        statusCode: 201,
        message: `Enrollment with id ${checkEnroll.id} has been updated with status ${status} and curChapterId ${curChapterId}`,
      });
    } catch (err) {
      //   console.log(err);
      next(err);
    }
  }
}

module.exports = EnrollmentController;
