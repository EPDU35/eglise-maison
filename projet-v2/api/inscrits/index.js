const connectDB = require('../../lib/db');
const Inscrit = require('../../lib/Inscrit');
const verifyToken = require('../../lib/auth');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await connectDB();

        // POST - Créer une inscription (public)
        if (req.method === 'POST') {
            const newInscrit = new Inscrit(req.body);
            const inscrit = await newInscrit.save();
            return res.json(inscrit);
        }

        // GET - Récupérer tous les inscrits (privé)
        if (req.method === 'GET') {
            verifyToken(req);

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
            return res.json(inscrits);
        }

        res.status(405).json({ message: 'Méthode non autorisée' });

    } catch (err) {
        console.error(err);
        if (err.message.includes('token') || err.message.includes('Token')) {
            return res.status(401).json({ message: err.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
