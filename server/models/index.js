import sequelize from '../config/database.js';
import User from './User.js';
import Supplier from './Supplier.js';
import Material from './Material.js';
import Furniture from './Furniture.js';
import FurnitureMaterial from './FurnitureMaterial.js';

Supplier.hasMany(Material, { foreignKey: 'supplierId', as: 'materials' });
Material.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

Furniture.belongsToMany(Material, { 
  through: FurnitureMaterial, 
  foreignKey: 'furnitureId',
  otherKey: 'materialId',
  as: 'materials'
});

Material.belongsToMany(Furniture, { 
  through: FurnitureMaterial, 
  foreignKey: 'materialId',
  otherKey: 'furnitureId',
  as: 'furnitures'
});

Furniture.hasMany(FurnitureMaterial, { foreignKey: 'furnitureId', as: 'furnitureMaterials' });
FurnitureMaterial.belongsTo(Furniture, { foreignKey: 'furnitureId', as: 'furniture' });

Material.hasMany(FurnitureMaterial, { foreignKey: 'materialId', as: 'furnitureMaterials' });
FurnitureMaterial.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });

export {
  sequelize,
  User,
  Supplier,
  Material,
  Furniture,
  FurnitureMaterial
};