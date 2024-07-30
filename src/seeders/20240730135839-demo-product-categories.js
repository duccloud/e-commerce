'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('product_categories', [
      { name: 'Electronics', created_at: new Date(), updated_at: new Date() },
      { name: 'Books', created_at: new Date(), updated_at: new Date() },
      { name: 'Clothing', created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
  }
};
