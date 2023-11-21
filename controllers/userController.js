const cloudinary = require("../helpers/cloudinary");
const { tokenCreate } = require("../helpers/jwt");
const { User } = require("../models/index");

class UserController {
  static async changePictProfile(req, res, next) {
    const { userId } = req.user;
    try {
      //   console.log("masukkkk", 6);
      console.log(cloudinary.uploader.upload);
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "internal server error ",
          });
        }

        const foundUser = await User.findByPk(userId);
        console.log(foundUser, 19);

        const sendTokenPayload = {
          userId: foundUser.id,
          userUsername: foundUser.username,
          userEmail: foundUser.email,
          userPremium: foundUser.isPremium,
          userPoint: foundUser.point,
          userProfilePict: result.url,
        };
        console.log(sendTokenPayload, 29);

        const token = tokenCreate(sendTokenPayload);
        console.log(token, 33);

        const data = await User.update(
          {
            profilePicture: result.url,
          },
          { where: { id: userId } }
        );
        // console.log(data, 22);

        res.status(200).json({
          statusCode: 200,
          access_token: token,
        });
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getUserDetail(req, res, next) {
    const { userId } = req.user;
    try {
      const result = await User.findByPk(userId);

      if (!result) {
        throw new Error("USER_NOT_FOUND");
      }

      res.status(201).json({
        statusCode: 201,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
