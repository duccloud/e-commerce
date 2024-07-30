const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        logging: process.env.DATABASE_LOGGING ? process.env.DATABASE_LOGGING.toLowerCase() === 'true' : false
    }
};
