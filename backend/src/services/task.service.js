import TaskRepository from '../repositories/task.repository.js';
import { repoUpdateTaskDTO } from '../dtos/task.dto.js';
import logger from '../utils/logger.js';

class TaskService {
  async getAllUserTasks(id) {
    try {
      logger.info(`[TaskService] Fetching tasks for user ${id}`);
      return await TaskRepository.getAllTasksByUserId(id);
    } catch (error) {
      logger.error(`[TaskService] Failed to fetch user tasks: ${error.message}\n${error.stack}`);
      throw new Error('Error while fetching tasks: ' + error.message);
    }
  }

  async getAllTasks() {
    try {
      logger.info(`[TaskService] Fetching all tasks (admin request)`);
      return await TaskRepository.getAllTasks();
    } catch (error) {
      logger.error(`[TaskService] Failed to fetch all tasks: ${error.message}\n${error.stack}`);
      throw new Error('Error while fetching tasks: ' + error.message);
    }
  }

  async getTaskById(taskId) {
    try {
      logger.info(`[TaskService] Fetching task by ID: ${taskId}`);
      return await TaskRepository.getTaskById(taskId);
    } catch (error) {
      logger.error(`[TaskService] Failed to fetch task by ID ${taskId}: ${error.message}\n${error.stack}`);
      throw new Error('Error while fetching task: ' + error.message);
    }
  }

  async createTask(taskData) {
    try {
      logger.info(`[TaskService] Creating task for user ${taskData.userId} with title: "${taskData.title}"`);
      return await TaskRepository.createTask(taskData);
    } catch (error) {
      logger.error(`[TaskService] Failed to create task: ${error.message}\n${error.stack}`);
      throw new Error('Error while creating task: ' + error.message);
    }
  }

  async updateTask(taskData) {
    const taskId = taskData.taskId;
    const repoDTO = repoUpdateTaskDTO(taskData);

    try {
      logger.info(`[TaskService] Updating task ${taskId} with data: ${JSON.stringify(repoDTO)}`);
      return await TaskRepository.updateTask(taskId, repoDTO);
    } catch (error) {
      logger.error(`[TaskService] Failed to update task ${taskId}: ${error.message}\n${error.stack}`);
      throw new Error('Error while updating task: ' + error.message);
    }
  }

  async deleteTask(taskId) {
    try {
      logger.info(`[TaskService] Deleting task ${taskId}`);
      return await TaskRepository.deleteTask(taskId);
    } catch (error) {
      logger.error(`[TaskService] Failed to delete task ${taskId}: ${error.message}\n${error.stack}`);
      throw new Error('Error while deleting task: ' + error.message);
    }
  }
}

export default new TaskService();
