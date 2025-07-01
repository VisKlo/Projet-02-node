import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FurnitureMaterial = sequelize.define('FurnitureMaterial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  furnitureId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Furnitures',
      key: 'id',
    },
  },
  materialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Materials',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  }
});

export default FurnitureMaterial;