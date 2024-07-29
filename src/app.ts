import dotenv from 'dotenv';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import sequelize from './config/database';

dotenv.config();

const app: Application = express();

// Sync all models with the database, creating tables if they do not exist
if (process.env.SEQUELIZE_FORCE_SYNC === 'true') {
    sequelize.sync();
}

app.use(bodyParser.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use(errorHandler);

export default app;
