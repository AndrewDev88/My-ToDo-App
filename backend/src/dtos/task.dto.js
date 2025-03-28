import TaskStatus from '../models/task.model.js';

export const CreateTaskDTO = (req) => ({
    title: req.body.title,
    description: req.body.description ?? '',
    status: TaskStatus.PENDING,
    userId: req.user.id,
    username: req.user.username,
});

export const buildUpdateTaskDTO  = (req) => ({
  taskId: Number(req.params.id),
  title: req.body.title,
  description: req.body.description,
  status: req.body.status,
  userId: req.user.id
});

export const repoUpdateTaskDTO = (newData) => ({
  title: newData.title,
  description: newData.description,
  status: newData.status,
});