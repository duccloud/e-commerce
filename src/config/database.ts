import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
   dialect: process.env.DATABASE_DIALECT as Dialect,
   database: process.env.DATABASE_NAME,
   username: process.env.DATABASE_USERNAME,
   password: process.env.DATABASE_PASSWORD,
   host: process.env.DATABASE_HOST,
   port: process.env.DATABASE_LOGGING ? parseInt(process.env.DATABASE_LOGGING, 10) : undefined,
   logging: process.env.DATABASE_LOGGING ? process.env.DATABASE_LOGGING.toLowerCase() === 'true' : false
});

export default sequelize;