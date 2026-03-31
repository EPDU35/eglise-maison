const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/login
// @desc    Connexion utilisateur
// @access  Public
router.post('/login', async (req, res) => {
    const { identifiant, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        let user = await User.findOne({ identifiant });
        if (!user) {
            return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect' });
        }

        // Créer et retourner le JWT
        const payload = {
            user: {
                id: user.id,
                identifiant: user.identifiant,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: {
                        id: user.id,
                        identifiant: user.identifiant,
                        role: user.role,
                        dateCreation: user.dateCreation
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// @route   POST /api/auth/init
// @desc    Initialiser l'utilisateur par défaut (à utiliser une seule fois)
// @access  Public
router.post('/init', async (req, res) => {
    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ identifiant: 'regioaké' });
        if (user) {
            return res.status(400).json({ message: 'Utilisateur par défaut déjà créé' });
        }

        // Créer l'utilisateur par défaut
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('1205', salt);

        user = new User({
            identifiant: 'regioaké',
            password: hashedPassword,
            role: 'super_admin'
        });

        await user.save();
        res.json({ message: 'Utilisateur par défaut créé avec succès' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;