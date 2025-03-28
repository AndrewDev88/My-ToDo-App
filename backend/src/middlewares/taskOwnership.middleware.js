import TaskRepository from '../repositories/task.repository.js';
import logger from '../utils/logger.js';

export const checkIfUserOwnsTask = async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;
    const userRole = req.user.role;

    logger.info(`[AccessCheck] User ${userId} with role "${userRole}" is requesting task ${taskId}`);

    if (userRole === 'admin') {
      logger.info(`[AccessCheck] Admin access granted for task ${taskId}`);
      return next();
    }

    const task = await TaskRepository.getTaskById(taskId);

    if (!task) {
      logger.info(`[AccessCheck] Task ${taskId} not found`);
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId !== userId) {
      logger.info(`[AccessCheck] Access denied. User ${userId} is not owner of task ${taskId}`);
      return res.status(403).json({ message: 'Forbidden: You do not own this task' });
    }

    logger.info(`[AccessCheck] Access granted for user ${userId} to task ${taskId}`);
    req.task = task;
    next();

  } catch (err) {
    logger.error(`[AccessCheck] Internal error: ${err.message}\n${err.stack}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};