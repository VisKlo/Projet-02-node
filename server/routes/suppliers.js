import express from 'express';
import { Supplier, Material } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

router.get('/:id/materials', async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) return res.status(404).json({ message: 'Fournisseur non trouvé' });

    const materials = await Material.findAll({ where: { supplierId } });

    res.json({ supplier, materials });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    
    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    
    await supplier.destroy();
    res.json({ message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;