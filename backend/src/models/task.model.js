// models/task.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in progress', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'tasks',
});

export default Task;