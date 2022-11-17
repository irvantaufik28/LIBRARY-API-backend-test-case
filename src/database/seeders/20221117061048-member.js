'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Members', [
      {
        id : 1,
        code: "M001",
        name: "Angga",
        email : "angga@mail.com",
        status : "NOT BORROWING",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id : 2 ,
        code: "M002",
        name: "Ferry",
        email: "ferry@mail.com",
        status: "BORROW",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        code: "M003",
        name: "Putri",
        status: "PENALTY",
        email: "putri@mail.com",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Members', null, {});
  }
};