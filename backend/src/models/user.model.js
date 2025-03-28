import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import { ROLES } from '../constants/roles.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,   
    allowNull: false         
  },

  role: {
    type: DataTypes.ENUM(ROLES.USER, ROLES.ADMIN), 
    defaultValue: ROLES.USER 
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false   
  },

  password: {
    type: DataTypes.STRING(255), 
    allowNull: false
  },

}, {
  timestamps: true,
  tableName: 'users',  
});

export default User;