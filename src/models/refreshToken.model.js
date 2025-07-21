import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './user.model.js';

const RefreshToken = sequelize.define('RefreshToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

RefreshToken.belongsTo(User,{
  onDelete: 'CASCADE',
});
User.hasMany(RefreshToken);

export default RefreshToken;
