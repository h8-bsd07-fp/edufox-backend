"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.hasMany(models.Chapter);
      Course.hasMany(models.Enrollment);
      Course.hasMany(models.Feedback);
      Course.belongsTo(models.Category);
    }
  }
  Course.init(
    {
      name: DataTypes.STRING,
      CategoryId: DataTypes.INTEGER,
      isPremium: DataTypes.BOOLEAN,
      imgUrl: DataTypes.STRING,
      rating: DataTypes.FLOAT,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
