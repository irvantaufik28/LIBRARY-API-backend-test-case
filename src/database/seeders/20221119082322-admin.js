const bcrypt = require("bcrypt")
'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('Admins', [
      {
        name: "Admin",
        username: "admin",
        email: "admin@gmail.com",
        password: bcrypt.hashSync('password', 10),
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('Admins', null, {});
     
  }
};