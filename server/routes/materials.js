import express from 'express';
import { Op } from 'sequelize';
import { Material, Supplier } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const materials = await Material.findAll({
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    
    if (!material) {
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const material = await Material.create(req.body);
    
    const populatedMaterial = await Material.findByPk(material.id, {
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    
    res.status(201).json(populatedMaterial);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }
    
    await material.update(req.body);
    
    const updatedMaterial = await Material.findByPk(material.id, {
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    
    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }
    
    await material.destroy();
    
    res.json({ message: 'Matériau supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/search/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword.toLowerCase();
    const materials = await Material.findAll({
      where: {
        keywords: {
          [Op.like]: `%${keyword}%`
        }
      },
      include: [
        {
          model: Supplier,
          as: 'supplier'
        }
      ]
    });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;