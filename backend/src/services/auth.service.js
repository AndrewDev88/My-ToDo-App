import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository.js';
import { createUserInternalDTO } from '../dtos/user.dto.js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

class AuthService {
  async register(userData) {
    const existing = await UserRepository.getUserByEmail(userData.email);
    if (existing) {
      logger.info(`Registration attempt failed: Email ${userData.email} already exists`);
      throw new Error('User already exists');
    }

    logger.info(`Registering new user: ${userData.email}`);
    const hashed = await bcrypt.hash(userData.password, 10);

    const userDTO = createUserInternalDTO(userData, hashed);
    const user = await UserRepository.createUser(userDTO);

    const token = await this.generateToken(user);

    logger.info(`User ${user.email} registered successfully`);
    return { user, token };
  }

  async login(userData) {
    const user = await UserRepository.getUserByEmail(userData.email);

    if (!user || !user.password) {
      logger.info(`Login failed: User not found or missing password (${userData.email})`);
      throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(userData.password.toString(), user.password.toString());
    if (!match) {
      logger.info(`Login failed: Invalid password for ${userData.email}`);
      throw new Error('Invalid credentials');
    }

    logger.info(`User ${user.email} logged in successfully`);
    const token = await this.generateToken(user);
    return { user, token };
  }

  async generateToken(user) {
    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    logger.info(`Generated JWT for user ${user.email} (ID: ${user.id})`);
    return token;
  }
}

export default new AuthService();