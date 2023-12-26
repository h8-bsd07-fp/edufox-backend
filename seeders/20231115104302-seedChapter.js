"use strict";
const chapter = require("../data/chapter.json");
chapter.forEach((el) => {
  el.updatedAt = el.createdAt = new Date();
});
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Chapters", chapter, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chapters", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
