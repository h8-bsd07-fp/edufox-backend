const { User } = require("../models/index");
const { tokenVerification } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw new Error("TOKEN_INVALID");
    }

    const verified = tokenVerification(access_token);

    const {
      userId,
      userUsername,
      userEmail,
      userPremium,
      userPoint,
      userProfilePict,
    } = verified;

    // findOne User bahwa user tersebut memang ada dari database
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    req.user = {
      userId,
      userUsername: user.username,
      userEmail,
      userPremium: user.isPremium,
      userPoint: user.point,
      userProfilePict,
    };

    next();
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

module.exports = authentication;
