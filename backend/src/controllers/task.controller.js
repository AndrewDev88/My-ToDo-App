import taskService from '../services/task.service.js';
import { CreateTaskDTO, buildUpdateTaskDTO } from '../dtos/task.dto.js';
import logger from '../utils/logger.js';

class TaskController {
  async getAllUserTasks(req, res) {
    try {
      const tasks = await taskService.getAllUserTasks(req.user.id);
      logger.info(`[Tasks] User ${req.user.id} fetched own tasks`);
      return res.status(200).json(tasks);
    } catch (error) {
      logger.error(`[Tasks] Failed to fetch user tasks: ${error.message}`);
      return res.status(500).json({
        message: 'Internal server error while fetching user tasks',
        error: error.message,
      });
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      logger.info(`[Tasks] Admin fetched all tasks`);
      return res.status(200).json(tasks);
    } catch (error) {
      logger.error(`[Tasks] Failed to fetch all tasks: ${error.message}`);
      return res.status(500).json({
        message: 'Internal server error while fetching all tasks',
        error: error.message,
      });
    }
  }

  async getTaskById(req, res) {
    const taskId = Number(req.params.id);

    try {
      const task = await taskService.getTaskById(taskId);
      if (!task) {
        logger.info(`[Tasks] Task ${taskId} not found`);
        return res.status(404).json({ message: 'Task not found' });
      }
      logger.info(`[Tasks] Task ${taskId} fetched`);
      return res.status(200).json(task);
    } catch (error) {
      logger.error(`[Tasks] Failed to fetch task ${taskId}: ${error.message}`);
      return res.status(500).json({
        message: 'Internal server error while fetching task',
        error: error.message,
      });
    }
  }

  async createTask(req, res) {
    const taskData = CreateTaskDTO(req);

    try {
      const newTask = await taskService.createTask(taskData);
      logger.info(`[Tasks] User ${taskData.userId} created task "${taskData.title}"`);
      return res.status(201).json(newTask);
    } catch (error) {
      logger.error(`[Tasks] Failed to create task: ${error.message}`);
      return res.status(400).json({
        message: 'Invalid task data',
        error: error.message,
      });
    }
  }

  async updateTask(req, res) {
    const taskData = buildUpdateTaskDTO(req);

    try {
      const updatedTask = await taskService.updateTask(taskData);
      if (!updatedTask) {
        logger.info(`[Tasks] Task ${taskData.taskId} not found for update`);
        return res.status(404).json({ message: 'Task not found' });
      }
      logger.info(`[Tasks] Task ${taskData.taskId} updated by user ${req.user.id}`);
      return res.status(200).json(updatedTask);
    } catch (error) {
      logger.error(`[Tasks] Failed to update task ${taskData.taskId}: ${error.message}`);
      return res.status(400).json({
        message: 'Failed to update task',
        error: error.message,
      });
    }
  }

  async deleteTask(req, res) {
    const taskId = Number(req.params.id);

    try {
      const deleted = await taskService.deleteTask(taskId);
      if (!deleted) {
        logger.info(`[Tasks] Task ${taskId} not found or already deleted`);
        return res.status(404).json({ message: 'Task not found or already deleted' });
      }
      logger.info(`[Tasks] Task ${taskId} deleted`);
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      logger.error(`[Tasks] Failed to delete task ${taskId}: ${error.message}`);
      return res.status(400).json({
        message: 'Failed to delete task',
        error: error.message,
      });
    }
  }
}

export default new TaskController();
