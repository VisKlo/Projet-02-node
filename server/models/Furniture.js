import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Furniture = sequelize.define('Furniture', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Furnitures',
  timestamps: true,
});

export default Furniture;
