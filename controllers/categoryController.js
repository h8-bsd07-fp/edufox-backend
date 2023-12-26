const { Category, Course } = require("../models/index");

class CategoryController {
  static async getAllCategory(req, res, next) {
    try {
      const result = await Category.findAll();

      res.status(200).json({
        statusCode: 200,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // static async getCategoryCourse(req, res, next) {
  //   const { categoryId } = req.params;
  //   try {
  //     const result = await Course.findAll({
  //       where: {
  //         CategoryId: categoryId,
  //       },
  //     });

  //     res.status(201).json({
  //       statusCode: 201,
  //       data: result,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}

module.exports = CategoryController;
