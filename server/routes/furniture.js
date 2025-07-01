import express from 'express';
import { Op } from 'sequelize';
import { Furniture, Material, Supplier, FurnitureMaterial } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/search/:keyword', async (req, res) => {
  try {
    const furniture = await Furniture.findAll({
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: [] }, // corrigé ici
          include: [{ model: Supplier, as: 'supplier' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const furniture = await Furniture.findAll({
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: [] },
          include: [{ model: Supplier, as: 'supplier' }]
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

router.get('/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: [] },
          include: [{ model: Supplier, as: 'supplier' }]
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

router.post('/', auth, async (req, res) => {
  try {
    console.log('Requête POST furniture reçue:', req.body);
    const { materials, ...furnitureData } = req.body;

    const furniture = await Furniture.create(furnitureData);

    if (materials && materials.length > 0) {
      for (const mat of materials) {
        await FurnitureMaterial.create({
          furnitureId: furniture.id,
          materialId: mat.material
        });
      }
    }

    const populatedFurniture = await Furniture.findByPk(furniture.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: [] },
          include: [{ model: Supplier, as: 'supplier' }],
        },
      ],
    });

    res.status(201).json(populatedFurniture);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { materials, ...furnitureData } = req.body;

    const furniture = await Furniture.findByPk(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: 'Meuble non trouvé' });
    }

    await furniture.update(furnitureData);

    if (materials) {
      await FurnitureMaterial.destroy({
        where: { furnitureId: furniture.id }
      });

      for (const material of materials) {
        await FurnitureMaterial.create({
          furnitureId: furniture.id,
          materialId: material.material
        });
      }
    }

    const updatedFurniture = await Furniture.findByPk(furniture.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: [] },
          include: [{ model: Supplier, as: 'supplier' }]
        }
      ]
    });

    res.json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id);

    if (!furniture) {
      return res.status(404).json({ message: 'Meuble non trouvé' });
    }
    await FurnitureMaterial.destroy({
      where: { furnitureId: furniture.id }
    });

    await furniture.destroy();

    res.json({ message: 'Meuble supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});



export default router;