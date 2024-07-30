// seeders/20240730135839-demo-products.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Product A',
        description: 'Description for Product A',
        price: 29.99,
        category_id: 1, // assuming you have a category with ID 1
        inventory_count: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Product B',
        description: 'Description for Product B',
        price: 49.99,
        category_id: 1, // assuming you have a category with ID 1
        inventory_count: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Product C',
        description: 'Description for Product C',
        price: 19.99,
        category_id: 2, // assuming you have a category with ID 2
        inventory_count: 150,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Product D',
        description: 'Description for Product D',
        price: 99.99,
        category_id: 2, // assuming you have a category with ID 2
        inventory_count: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Product E',
        description: 'Description for Product E',
        price: 39.99,
        category_id: 3, // assuming you have a category with ID 3
        inventory_count: 75,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
