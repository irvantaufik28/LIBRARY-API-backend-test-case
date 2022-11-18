'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Borrows', 'totalBooks', { type: Sequelize.INTEGER, allowNull: true });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Borrows', 'totalBooks');
  }
};