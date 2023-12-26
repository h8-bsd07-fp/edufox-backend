const { tokenCreate } = require("../helpers/jwt");
const { User } = require("../models/index");
const midtransClient = require("midtrans-client");

class TransactionController {
  static async makeUserPremium(req, res, next) {
    const { userId, userUsername, userEmail, userPoint, userProfilePict } =
      req.user;
    try {
      const user = await User.findByPk(userId);
      // if (!user) {
      //   throw new Error("USER_NOT_FOUND");
      // }
      const result = await User.update(
        {
          isPremium: true,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      const sendTokenPayload = {
        userId,
        userUsername,
        userEmail,
        userPremium: true,
        userPoint,
        userProfilePict,
      };

      const token = tokenCreate(sendTokenPayload);

      res.status(201).json({
        statusCode: 201,
        access_token: token,
        message: `user with id ${userId} has become premium`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async generateTokenMidtrants(req, res, next) {
    const { userId, userEmail } = req.user;
    try {
      const user = await User.findByPk(userId);
      // if (!user) {
      //   throw new Error("USER_NOT_FOUND");
      // }
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id:
            "TRANSACTION_" + Math.floor(1000000 + Math.random() * 9000000),
          gross_amount: 45000,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: userEmail,
        },
      };
      const midtransToken = await snap.createTransaction(parameter);

      res.status(201).json({
        statusCode: 201,
        data: midtransToken,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransactionController;
