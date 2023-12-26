const { User } = require("../models/index");

class RegisterController {
  static async userRegister(req, res, next) {
    const { username, email, password } = req.body;
    try {
      const result = await User.create({
        username,
        email,
        password,
      });

      const userData = {
        id: result.id,
        email,
      };

      res.status(201).json({
        statusCode: 201,
        data: userData,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = RegisterController;
