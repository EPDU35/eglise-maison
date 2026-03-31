const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users
// @desc    Récupérer tous les utilisateurs
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ dateCreation: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// @route   POST /api/users
// @desc    Créer un nouvel utilisateur
// @access  Private (Admin seulement)
router.post('/', auth, async (req, res) => {
    const { identifiant, password, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ identifiant });
        if (user) {
            return res.status(400).json({ message: 'Cet identifiant existe déjà' });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer le nouvel utilisateur
        user = new User({
            identifiant,
            password: hashedPassword,
            role: role || 'admin'
        });

        await user.save();

        // Retourner l'utilisateur sans le mot de passe
        res.json({
            id: user.id,
            identifiant: user.identifiant,
            role: user.role,
            dateCreation: user.dateCreation
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// @route   PUT /api/users/password
// @desc    Changer son mot de passe
// @access  Private
router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Récupérer l'utilisateur
        const user = await User.findById(req.user.id);

        // Vérifier le mot de passe actuel
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Le mot de passe actuel est incorrect' });
        }

        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// @route   DELETE /api/users/:id
// @desc    Supprimer un utilisateur
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Empêcher la suppression de son propre compte
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await user.deleteOne();
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;