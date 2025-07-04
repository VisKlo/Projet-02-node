import express from 'express';
import { Furniture, Material } from '../models/index.js';
import { fn, col } from 'sequelize';
import auth from '../middleware/auth.js';

const router = express.Router();

// Route pour récupérer les données du dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Nombre total de meubles
    const totalFurniture = await Furniture.count();

    // Nombre total de matériaux
    const totalMaterials = await Material.count();

    // Nombre de meubles par catégorie
    const furnitureByCategory = await Furniture.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['category']
    });

    // Quantité disponible pour chaque matériau
    const materialQuantities = await Material.findAll({
      attributes: ['name', 'quantity'],
      order: [['name', 'ASC']]
    });

    // Derniers meubles créés avec leurs matériaux
    const recentFurniture = await Furniture.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Material,
          as: 'materials',
          through: {
            attributes: ['quantity']
          }
        }
      ]
    });

    // Meubles créés par mois
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

    // Envoi des données formatées
    res.json({
      totals: {
        furniture: totalFurniture,
        materials: totalMaterials
      },
      furnitureByCategory: furnitureByCategory.map(item => ({
        id: item.category,
        count: parseInt(item.dataValues.count)
      })),
      materialQuantities: materialQuantities.map(mat => ({
        name: mat.name,
        quantity: mat.quantity
      })),
      recentFurniture,
      monthlyFurniture: monthlyFurniture.map(item => ({
        id: {
          year: item.dataValues.year,
          month: item.dataValues.month
        },
        count: parseInt(item.dataValues.count)
      }))
    });
  } catch (error) {
    console.error('Erreur dans /api/stats/dashboard:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
