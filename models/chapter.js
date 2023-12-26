"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chapter.belongsTo(models.Course);
      Chapter.hasMany(models.Enrollment, { foreignKey: "curChapterId" });
    }
  }
  Chapter.init(
    {
      name: DataTypes.STRING,
      chapterNo: DataTypes.INTEGER,
      videoUrl: DataTypes.STRING,
      description: DataTypes.TEXT,
      CourseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Chapter",
    }
  );
  return Chapter;
};
