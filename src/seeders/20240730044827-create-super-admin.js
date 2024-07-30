'use strict';

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the password for the super admin
    const adminPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

    // Hash the password for the new members
    const memberPassword = await bcrypt.hash('helloworld', 10);

    return queryInterface.bulkInsert('users', [
      {
        username: process.env.SUPER_ADMIN_USERNAME,
        password: adminPassword,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user1',
        password: memberPassword,
        role: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user2',
        password: memberPassword,
        role: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user3',
        password: memberPassword,
        role: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      username: {
        [Sequelize.Op.in]: [
          process.env.SUPER_ADMIN_USERNAME,
          'user1',
          'user2',
          'user3',
        ],
      },
    });
  },
};
