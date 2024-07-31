import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';

const config = {
   development: {
      dialect: process.env.DATABASE_DIALECT as Dialect,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
      logging: process.env.DATABASE_LOGGING ? process.env.DATABASE_LOGGING.toLowerCase() === 'true' : false
   },
   test: {
      dialect: process.env.DATABASE_DIALECT as Dialect,
      database: process.env.DATABASE_TEST_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
      logging: process.env.DATABASE_LOGGING ? process.env.DATABASE_LOGGING.toLowerCase() === 'true' : false
   },
   production: {
      dialect: process.env.DATABASE_DIALECT as Dialect,
      database: process.env.DATABASE_PROD_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
      logging: process.env.DATABASE_LOGGING ? process.env.DATABASE_LOGGING.toLowerCase() === 'true' : false
   }
};

const sequelize = new Sequelize(config[environment as keyof typeof config]);

export default sequelize;