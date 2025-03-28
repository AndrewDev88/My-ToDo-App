import logger from '../utils/logger.js';

export function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      logger.info('Authorization failed: No user object on request');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (allowedRoles.includes(req.user.role)) {
      logger.info(`[AccessCheck] Access granted for user ${req.user.id} with role "${req.user.role}"`);
      return next();
    }

    logger.info(`[AccessDenied] ${req.method} ${req.originalUrl} — User ${req.user.id} with role "${req.user.role}" denied. Required: ${allowedRoles.join(', ')}`);
    return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
  };
}