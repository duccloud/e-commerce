'use strict';

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
    
    return queryInterface.bulkInsert('users', [{
      username: process.env.SUPER_ADMIN_USERNAME,
      password: hashedPassword,
      role: 'ADMIN',
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { username: process.env.SUPER_ADMIN_USERNAME }, {});
  }
};
