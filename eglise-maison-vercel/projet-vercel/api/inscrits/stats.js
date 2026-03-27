const connectDB = require('../../lib/db');
const Inscrit = require('../../lib/Inscrit');
const verifyToken = require('../../lib/auth');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

    try {
        verifyToken(req);
        await connectDB();

        const total = await Inscrit.countDocuments();
        const hommes = await Inscrit.countDocuments({ sexe: 'Homme' });
        const femmes = await Inscrit.countDocuments({ sexe: 'Femme' });

        res.json({ total, hommes, femmes });

    } catch (err) {
        console.error(err);
        if (err.message.includes('token') || err.message.includes('Token')) {
            return res.status(401).json({ message: err.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
