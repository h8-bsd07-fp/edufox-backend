const cloudinary = require("../helpers/cloudinary");
const { tokenCreate } = require("../helpers/jwt");
const { User, sequelize } = require("../models/index");

class UserController {
  static async changePictProfile(req, res, next) {
    const { userId } = req.user;
    const transaction = await sequelize.transaction()
    try {
      // console.log(cloudinary.uploader.upload);
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "internal server error ",
          });
        }

        const foundUser = await User.findByPk(userId, { transaction });
        // console.log(foundUser, 19);

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
        // console.log(token, 33);

        await User.update(
          {
            profilePicture: result.url,
          },
          { where: { id: userId }, transaction }
        );
        // console.log(data, 22);
        await transaction.commit()
        res.status(200).json({
          statusCode: 200,
          access_token: token,
        });
      });
    } catch (error) {
      await transaction.rollback()
      // console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
