import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';

class TaskRepository {
  async getAllTasksByUserId(userId) {
    try {
      return await Task.findAll({
        where: { userId },
        include: {
          model: User,
          attributes: ['username'],
        }
      });
    } catch (error) {
      logger.error(`[TaskRepository] Failed to fetch tasks for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async getAllTasks() {
    try {
      return await Task.findAll({
        include: {
          model: User,
          attributes: ['username'],
        }
      });
    } catch (error) {
      logger.error(`[TaskRepository] Failed to fetch all tasks: ${error.message}`);
      throw error;
    }
  }

  async getTaskById(id) {
    try {
      return await Task.findByPk(id, {
        include: {
          model: User,
          attributes: ['username'],
        }
      });
    } catch (error) {
      logger.error(`[TaskRepository] Failed to fetch task by ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      return await Task.create(taskData);
    } catch (error) {
      logger.error(`[TaskRepository] Failed to create task: ${error.message}`);
      throw error;
    }
  }

  async updateTask(taskId, newData) {
    try {
      const [updated] = await Task.update(newData, { where: { id: taskId } });
      if (updated === 0) return null;
      return await Task.findByPk(taskId, {
        include: {
          model: User,
          attributes: ['username'],
        }
      });
    } catch (error) {
      logger.error(`[TaskRepository] Failed to update task ${taskId}: ${error.message}`);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      const deleted = await Task.destroy({ where: { id: taskId } });
      return deleted > 0;
    } catch (error) {
      logger.error(`[TaskRepository] Failed to delete task ${taskId}: ${error.message}`);
      throw error;
    }
  }
}

export default new TaskRepository();
