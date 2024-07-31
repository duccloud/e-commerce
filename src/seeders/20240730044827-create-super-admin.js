'use strict';

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the password for the super admin
    const adminPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

    // Hash the password for the new customer
    const customerPassword = await bcrypt.hash('helloworld', 10);
    
    // Hash the password for the new seller
    const sellerPassword = await bcrypt.hash('helloworld', 10);

    return queryInterface.bulkInsert('users', [
      {
        username: process.env.SUPER_ADMIN_USERNAME,
        password: adminPassword,
        role: 'ADMIN',
        email: 'admin@demo.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'user1',
        password: customerPassword,
        role: 'CUSTOMER',
        email: 'customer1@demo.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'user2',
        password: customerPassword,
        role: 'CUSTOMER',
        email: 'customer2@demo.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'user3',
        password: customerPassword,
        role: 'CUSTOMER',
        email: 'customer3@demo.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // New sellers
      {
        username: 'seller1',
        password: sellerPassword,
        role: 'SELLER',
        email: 'seller1@demo.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'seller2',
        password: sellerPassword,
        role: 'SELLER',
        email: 'seller2@demo.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'seller3',
        password: sellerPassword,
        role: 'SELLER',
        email: 'seller3@demo.com',
        created_at: new Date(),
        updated_at: new Date(),
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
          'seller1',
          'seller2',
          'seller3',
        ],
      },
    });
  },
};
