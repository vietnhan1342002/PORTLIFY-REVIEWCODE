import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // user, admin,...
  },

  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },

}, {
  timestamps: true,
});



export default User;

