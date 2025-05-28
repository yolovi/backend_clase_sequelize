'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'John',
        email: 'example@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Alice",
        email: "alice@example.com", 
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};