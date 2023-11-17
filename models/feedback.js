"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feedback.belongsTo(models.Course);
      Feedback.belongsTo(models.User);
    }
  }
  Feedback.init(
    {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "need feedback rating",
          },
          notNull: {
            msg: "need feedback rating",
          },
          len: [0, 101],
        },
      },
      comment: DataTypes.STRING,
      CourseId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );
  return Feedback;
};
