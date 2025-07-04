import express from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/index.js';

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà par email ou nom
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { name }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Un utilisateur avec cet email ou nom existe déjà'
      });
    }

    // Crée un nouvel utilisateur
    const user = await User.create({ name, email, password });

    // Génère un token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Retourne les infos de l'utilisateur + token
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cherche l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifie le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Génère un token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Retourne les infos de l'utilisateur + token
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;
