import express from 'express';
import { Furniture, Material, Supplier, FurnitureMaterial } from '../models/index.js';
import { sequelize } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Rechercher des meubles par mot-clé (champ `keywords`)
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;

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
          through: { attributes: ['quantity'] },
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

// Lister tous les meubles avec leurs matériaux et fournisseurs
router.get('/', async (req, res) => {
  try {
    const furniture = await Furniture.findAll({
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: ['quantity'] },
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

// Obtenir un meuble par ID avec ses matériaux et fournisseur
router.get('/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findByPk(req.params.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: ['quantity'] },
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

// Créer un nouveau meuble et mettre à jour le stock des matériaux utilisés
router.post('/', auth, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { materials, ...furnitureData } = req.body;

    // Vérifie la disponibilité des matériaux
    for (const mat of materials) {
      const material = await Material.findByPk(mat.material, { transaction: t });
      if (!material || material.quantity < mat.quantity) {
        throw new Error(`Stock insuffisant pour le matériau ID ${mat.material} (stock: ${material?.quantity || 0})`);
      }
    }

    // Crée le meuble
    const furniture = await Furniture.create(furnitureData, { transaction: t });

    // Crée les liaisons meubles-matériaux + met à jour le stock
    for (const mat of materials) {
      await FurnitureMaterial.create({
        furnitureId: furniture.id,
        materialId: mat.material,
        quantity: mat.quantity,
      }, { transaction: t });

      const material = await Material.findByPk(mat.material, { transaction: t });
      material.quantity -= mat.quantity;
      await material.save({ transaction: t });
    }

    await t.commit();

    // Retourne le meuble
    const populated = await Furniture.findByPk(furniture.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: ['quantity'] },
          include: [{ model: Supplier, as: 'supplier' }],
        },
      ],
    });

    res.status(201).json(populated);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
});

// Modifier un meuble et réajuster le stock en conséquence
router.put('/:id', auth, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { materials, ...furnitureData } = req.body;
    const furniture = await Furniture.findByPk(req.params.id, { transaction: t });
    if (!furniture) {
      throw new Error('Meuble non trouvé');
    }

    // Restaure le stock des anciens matériaux
    const oldMaterials = await FurnitureMaterial.findAll({
      where: { furnitureId: furniture.id },
      transaction: t,
    });
    for (const oldMat of oldMaterials) {
      const material = await Material.findByPk(oldMat.materialId, { transaction: t });
      material.quantity += oldMat.quantity;
      await material.save({ transaction: t });
    }

    // Supprime les anciennes liaisons
    await FurnitureMaterial.destroy({
      where: { furnitureId: furniture.id },
      transaction: t,
    });

    // Vérifie la disponibilité des nouveaux matériaux
    for (const mat of materials) {
      const material = await Material.findByPk(mat.material, { transaction: t });
      if (!material || material.quantity < mat.quantity) {
        throw new Error(`Stock insuffisant pour le matériau ID ${mat.material} (stock: ${material?.quantity || 0})`);
      }
    }

    // Met à jour le meuble
    await furniture.update(furnitureData, { transaction: t });

    // Ajoute les nouveaux matériaux et ajuste le stock
    for (const mat of materials) {
      await FurnitureMaterial.create({
        furnitureId: furniture.id,
        materialId: mat.material,
        quantity: mat.quantity
      }, { transaction: t });

      const material = await Material.findByPk(mat.material, { transaction: t });
      material.quantity -= mat.quantity;
      await material.save({ transaction: t });
    }

    await t.commit();

    // Retourne l’objet mis à jour
    const updated = await Furniture.findByPk(furniture.id, {
      include: [
        {
          model: Material,
          as: 'materials',
          through: { attributes: ['quantity'] },
          include: [{ model: Supplier, as: 'supplier' }],
        },
      ],
    });

    res.json(updated);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: 'Erreur mise à jour', error: error.message });
  }
});

// Supprime un meuble et ses liaisons avec les matériaux
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
