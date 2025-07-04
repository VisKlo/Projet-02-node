// routes/suppliers.js
import express from 'express';
import { Supplier, Material } from '../models/index.js';

const router = express.Router();

// GET /suppliers - liste tous les fournisseurs avec leurs matériaux
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      include: [{ model: Material, as: 'materials' }]
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
