const express = require('express');
const router = express.Router();
const Inscrit = require('../models/Inscrit');
const auth = require('../middleware/auth');

// @route   POST /api/inscrits
// @desc    Créer une nouvelle inscription
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newInscrit = new Inscrit(req.body);
        const inscrit = await newInscrit.save();
        res.json(inscrit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// @route   GET /api/inscrits
// @desc    Récupérer tous les inscrits (avec filtres)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { nom, sexe, zone, egliseLocale, responsabilite } = req.query;
        
        let filter = {};
        
        if (nom) {
            filter.$or = [
                { nom: { $regex: nom, $options: 'i' } },
                { prenoms: { $regex: nom, $options: 'i' } }
            ];
        }
        if (sexe) filter.sexe = sexe;
        if (zone) filter.zone = zone;
        if (egliseLocale) filter.egliseLocale = egliseLocale;
        if (responsabilite) filter.responsabilite = responsabilite;

        const inscrits = await Inscrit.find(filter).sort({ dateInscription: -1 });
        res.json(inscrits);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// @route   GET /api/inscrits/stats
// @desc    Récupérer les statistiques
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const total = await Inscrit.countDocuments();
        const hommes = await Inscrit.countDocuments({ sexe: 'Homme' });
        const femmes = await Inscrit.countDocuments({ sexe: 'Femme' });

        res.json({
            total,
            hommes,
            femmes
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// @route   GET /api/inscrits/:id
// @desc    Récupérer un inscrit par ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const inscrit = await Inscrit.findById(req.params.id);
        
        if (!inscrit) {
            return res.status(404).json({ message: 'Inscrit non trouvé' });
        }

        res.json(inscrit);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Inscrit non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
});

// @route   PUT /api/inscrits/:id
// @desc    Modifier un inscrit
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let inscrit = await Inscrit.findById(req.params.id);

        if (!inscrit) {
            return res.status(404).json({ message: 'Inscrit non trouvé' });
        }

        inscrit = await Inscrit.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json(inscrit);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Inscrit non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
});

// @route   DELETE /api/inscrits/:id
// @desc    Supprimer un inscrit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const inscrit = await Inscrit.findById(req.params.id);

        if (!inscrit) {
            return res.status(404).json({ message: 'Inscrit non trouvé' });
        }

        await inscrit.deleteOne();
        res.json({ message: 'Inscrit supprimé' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Inscrit non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;