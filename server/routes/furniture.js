import express from 'express';
import { Op } from 'sequelize';
import { Furniture, Material, Supplier, FurnitureMaterial } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all furniture
router.get('/', async (req, res) => {
  try {
    const furniture = await Furniture.findAll({
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: ['quantity', 'unit'] },
          include: [
            {
              model: Supplier,
              as: 'supplier'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(furniture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


// Get furniture by ID
router.get('/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: {
            attributes: ['quantity', 'unit']
          },
          include: [
            {
              model: Supplier,
              as: 'supplier'
            }
          ]
        }
      ]
    });

    if (!furniture) {
      return res.status(404).json({ message: 'Meuble non trouvé' });
    }

    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Create furniture
router.post('/', auth, async (req, res) => {
  try {
    const { materials, ...furnitureData } = req.body;

    const furniture = await Furniture.create(furnitureData);

    // Add materials if provided
    if (materials && materials.length > 0) {
      for (const material of materials) {
        await FurnitureMaterial.create({
          furnitureId: furniture.id,
          materialId: material.material,
          quantity: material.quantity,
          unit: material.unit
        });
      }
    }

    // Fetch the complete furniture with materials
    const populatedFurniture = await Furniture.findByPk(furniture.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: {
            attributes: ['quantity', 'unit']
          },
          include: [
            {
              model: Supplier,
              as: 'supplier'
            }
          ]
        }
      ]
    });

    res.status(201).json(populatedFurniture);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

// Update furniture
router.put('/:id', auth, async (req, res) => {
  try {
    const { materials, ...furnitureData } = req.body;

    const furniture = await Furniture.findByPk(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: 'Meuble non trouvé' });
    }

    await furniture.update(furnitureData);

    // Update materials if provided
    if (materials) {
      // Remove existing materials
      await FurnitureMaterial.destroy({
        where: { furnitureId: furniture.id }
      });

      // Add new materials
      for (const material of materials) {
        await FurnitureMaterial.create({
          furnitureId: furniture.id,
          materialId: material.material,
          quantity: material.quantity,
          unit: material.unit
        });
      }
    }

    // Fetch the updated furniture with materials
    const updatedFurniture = await Furniture.findByPk(furniture.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: {
            attributes: ['quantity', 'unit']
          },
          include: [
            {
              model: Supplier,
              as: 'supplier'
            }
          ]
        }
      ]
    });

    res.json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

// Delete furniture
router.delete('/:id', auth, async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id);

    if (!furniture) {
      return res.status(404).json({ message: 'Meuble non trouvé' });
    }

    // Delete associated materials first
    await FurnitureMaterial.destroy({
      where: { furnitureId: furniture.id }
    });

    await furniture.destroy();

    res.json({ message: 'Meuble supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Search furniture by keywords
router.get('/search/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword.toLowerCase();
    const furniture = await Furniture.findAll({
      where: {
        keywords: {
          [Op.like]: `%${keyword}%`
        }
      },
      include: [
        {
          model: Material,
          as: 'materials',
          through: {
            attributes: ['quantity', 'unit']
          },
          include: [
            {
              model: Supplier,
              as: 'supplier'
            }
          ]
        }
      ]
    });

    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;