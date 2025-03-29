import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './src/database/db.js';
import taskRouter from './src/routes/task.routes.js';
import authRouter from './src/routes/auth.routes.js';
import logger from './src/utils/logger.js';

import { errorHandler } from './src/middlewares/error.middleware.js';

import './src/models/index.js';
import { createInitialAdmin } from './src/utils/InitAdmin.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  logger.info('Running in development mode');
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));
}

app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRouter);

if (process.env.NODE_ENV === 'production') {
  logger.info('Running in production mode');

  const clientPath = path.join(__dirname, './public');
  app.use(express.static(clientPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientPath, 'index.html'));
  });
}

app.use(errorHandler);

sequelize.authenticate()
  .then(() => {
    logger.info('Database connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    logger.info('Models synced');
    return createInitialAdmin();
  })
  .then(() => {
    logger.info('Initial admin ready');
  })
  .catch((err) => {
    logger.error(`Database error: ${err.message}\n${err.stack}`);
  });

app.listen(process.env.SERVER_PORT, () => {
  logger.info(`Server running at http://localhost:${process.env.SERVER_PORT}`);
});
