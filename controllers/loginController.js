const { plaintextAndPasswordCompare } = require("../helpers/bcrypt");
const { tokenCreate } = require("../helpers/jwt");
const { User } = require("../models/index");

class LoginController {
  static async userLogin(req, res, next) {
    const { email, username, password } = req.body;


    const authenticator = email ? { email } : { username }

    try {
      if (!(email || username) || !password) throw new Error("EMPTY_INPUT")
      const foundUser = await User.findOne({
        where: authenticator,
      });

      if (!foundUser) {
        throw new Error("");
      }

      if (!plaintextAndPasswordCompare(password, foundUser.password)) {
        throw new Error("PASSWORD_INVALID");
      }

      const sendTokenPayload = {
        userId: foundUser.id,
        userUsername: foundUser.username,
        userEmail: foundUser.email,
        userPremium: foundUser.isPremium,
        userPoint: foundUser.point,
        userProfilePict: foundUser.profilePicture,
      };

      const token = tokenCreate(sendTokenPayload);

      res.status(200).json({
        statusCode: 200,
        access_token: token
        // data: {
        //   access_token: token,
        //   userUsername: foundUser.username,
        //   userEmail: foundUser.email,
        //   userPremium: foundUser.isPremium,
        //   userPoint: foundUser.point,
        //   userProfilePict: foundUser.profilePicture,
        // },
      });
    } catch (err) {
      console.log(err, 49);
      next(err);
    }
  }
}

module.exports = LoginController;
