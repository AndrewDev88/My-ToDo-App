import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    logger.info('Authentication failed: No token provided');
    return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    logger.info(`[Auth] ${req.method} ${req.originalUrl} → User ${payload.id} (${payload.role})`);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.info('Authentication failed: Token expired');
      return res.status(401).json({ message: 'Token expired, please login again' });
    }

    logger.error(`Authentication error: ${err.message}\n${err.stack}`);
    return res.status(401).json({ message: 'Invalid token' });
  }
}