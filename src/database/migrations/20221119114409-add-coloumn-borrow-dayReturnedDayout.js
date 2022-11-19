module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Borrows', 'dayOut', {
        type: Sequelize.STRING
      });
      await queryInterface.addColumn('Borrows', 'dayReturned', {
        type: Sequelize.STRING
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Challenges', 'dayOut');
      await queryInterface.removeColumn('Challenges', 'dayReturned');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};