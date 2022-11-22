module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Penalties', 'isActive', {
        type: Sequelize.BOOLEAN
      });
      await queryInterface.addColumn('Penalties', 'borrowId', {
        type: Sequelize.INTEGER
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Penalties', 'isActive');
      await queryInterface.removeColumn('Penalties', 'borrowId');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};