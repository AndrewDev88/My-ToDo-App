// src/utils/initAdmin.js
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';
import dotenv from 'dotenv';
import logger from './logger.js';
dotenv.config();

export async function createInitialAdmin() {
  const existingAdmin = await User.findOne({ where: { role: ROLES.ADMIN } });

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hash(process.env.INIT_ADMIN_PASSWORD, 10);
    const hashedPasswordString = hashedPassword;
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPasswordString,
      role: ROLES.ADMIN,
    });

    logger.info('Initial admin user created');
  } else {
    logger.info('Admin ready');
  }
}