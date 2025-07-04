import express from 'express';
import { Op } from 'sequelize';
import { Material, Supplier } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Récupère tous les matériaux avec leur fournisseur
router.get('/', async (req, res) => {
  try {
    const materials = await Material.findAll({
      include: [{ model: Supplier, as: 'supplier' }]
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Récupère un matériau par son ID (avec le fournisseur associé)
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [{ model: Supplier, as: 'supplier' }]
    });
    
    if (!material) {
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

//  Ajouter de la quantité à un matériaux
router.post('/:id/addQuantity', async (req, res) => {
  try {
    const materialId = req.params.id;
    const { quantityToAdd } = req.body;

    const material = await Material.findByPk(materialId);
    if (!material) return res.status(404).json({ message: 'Matériau non trouvé' });

    material.quantity = (material.quantity || 0) + Number(quantityToAdd);
    await material.save();

    res.json({ message: 'Quantité mise à jour', material });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Modifier un matériau existant
router.put('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Matériau non trouvé' });
    }

    await material.update(req.body);

    // Renvoie le matériau mis à jour avec son fournisseur
    const updatedMaterial = await Material.findByPk(material.id, {
      include: [{ model: Supplier, as: 'supplier' }]
    });
    
    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

// Rechercher des matériaux par mot-clé (dans le champ `keywords`)
router.get('/search/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword.toLowerCase();

    const materials = await Material.findAll({
      where: {
        keywords: {
          [Op.like]: `%${keyword}%`
        }
      },
      include: [{ model: Supplier, as: 'supplier' }]
    });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
