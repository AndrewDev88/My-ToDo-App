import authService from '../services/auth.service.js';
import { registerDTO, loginDTO } from '../dtos/user.dto.js';
import logger from '../utils/logger.js';

class AuthController {
  async signUp(req, res) {
    const userData = registerDTO(req);

    try {
      const { user, token } = await authService.register(userData);

      res.cookie('token', token, { httpOnly: true });
      const { id, username, role } = user;

      logger.info(`[Auth] New user registered: ID ${id}, username "${username}", role "${role}"`);

      return res.status(201).json({
        message: 'User registered successfully',
        user: { id, username, role }
      });
    } catch (error) {
      logger.error(`[Auth] Registration failed: ${error.message}`);
      return res.status(400).json({
        message: 'Registration failed',
        error: {
          message: error.message,
          name: error.name
        }
      });
    }
  }

  async login(req, res) {
    const userData = loginDTO(req);

    try {
      const { user, token } = await authService.login(userData);

      res.cookie('token', token, { httpOnly: true });
      const { id, username, role } = user;

      logger.info(`[Auth] User logged in: ID ${id}, username "${username}", role "${role}"`);

      return res.status(200).json({
        message: 'User logged in successfully',
        user: { id, username, role }
      });
    } catch (error) {
      logger.error(`[Auth] Login failed: ${error.message}`);
      return res.status(401).json({
        message: 'Authentication failed',
        error: {
          message: error.message,
          name: error.name
        }
      });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('token');
      logger.info(`[Auth] User logged out`);
      return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
      logger.error(`[Auth] Logout failed: ${error.message}`);
      return res.status(500).json({
        message: 'Logout failed',
        error: {
          message: error.message,
          name: error.name
        }
      });
    }
  }

  async getUserInfo(req, res) {
    if (!req.user) {
      logger.info('[Auth] No user in request');
      return res.status(200).json({ user: null });
    }

    const { id, username, role } = req.user;

    logger.info(`[Auth] Returning info for user ID ${id}, username "${username}", role "${role}"`);

    return res.status(200).json({ user: { id, username, role } });
  }
}

export default new AuthController();
