'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Members', 'status', { type: Sequelize.STRING, allowNull: false });
    queryInterface.addColumn('Members', 'email', { type: Sequelize.STRING, allowNull: false });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Members', 'status');
    queryInterface.removeColumn('Members', 'email');
  }
};
