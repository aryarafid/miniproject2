"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     *
     */
    await queryInterface.createTable("country", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

        allowNull: false,
      },
      country_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable("country");
  },
};
