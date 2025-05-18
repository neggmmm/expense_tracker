'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Expenses', 'category', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Expenses', 'category');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
