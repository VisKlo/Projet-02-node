import express from 'express';
import { Furniture, Material, Supplier } from '../models/index.js';
import { Op, fn, col } from 'sequelize';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Count totals
    const totalFurniture = await Furniture.count();
    const totalMaterials = await Material.count();
    
    // Furniture by category
    const furnitureByCategory = await Furniture.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['category']
    });
    
    // Materials by category
    const materialsByCategory = await Material.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['category']
    });
    
    // Recent furniture (last 10)
    const recentFurniture = await Furniture.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Material,
          as: 'materials',
          through: {
            attributes: ['quantity', 'unit']
          }
        }
      ]
    });
    
    // Monthly furniture creation
    const monthlyFurniture = await Furniture.findAll({
      attributes: [
        [fn('YEAR', col('createdAt')), 'year'],
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: [fn('YEAR', col('createdAt')), fn('MONTH', col('createdAt'))],
      order: [[fn('YEAR', col('createdAt')), 'ASC'], [fn('MONTH', col('createdAt')), 'ASC']],
      limit: 12
    });
    
    res.json({
      totals: {
        furniture: totalFurniture,
        materials: totalMaterials
      },
      furnitureByCategory: furnitureByCategory.map(item => ({
        _id: item.category,
        count: parseInt(item.dataValues.count)
      })),
      furnitureByStatus: furnitureByStatus.map(item => ({
        _id: item.status,
        count: parseInt(item.dataValues.count)
      })),
      materialsByCategory: materialsByCategory.map(item => ({
        _id: item.category,
        count: parseInt(item.dataValues.count)
      })),
      recentFurniture,
      monthlyFurniture: monthlyFurniture.map(item => ({
        _id: {
          year: item.dataValues.year,
          month: item.dataValues.month
        },
        count: parseInt(item.dataValues.count)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;