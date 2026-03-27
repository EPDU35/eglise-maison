const connectDB = require('../../lib/db');
const Inscrit = require('../../lib/Inscrit');
const verifyToken = require('../../lib/auth');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        verifyToken(req);
        await connectDB();

        const { id } = req.query;

        // GET par ID
        if (req.method === 'GET') {
            const inscrit = await Inscrit.findById(id);
            if (!inscrit) return res.status(404).json({ message: 'Inscrit non trouvé' });
            return res.json(inscrit);
        }

        // PUT - Modifier
        if (req.method === 'PUT') {
            const inscrit = await Inscrit.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true, runValidators: true }
            );
            if (!inscrit) return res.status(404).json({ message: 'Inscrit non trouvé' });
            return res.json(inscrit);
        }

        // DELETE - Supprimer
        if (req.method === 'DELETE') {
            const inscrit = await Inscrit.findById(id);
            if (!inscrit) return res.status(404).json({ message: 'Inscrit non trouvé' });
            await inscrit.deleteOne();
            return res.json({ message: 'Inscrit supprimé' });
        }

        res.status(405).json({ message: 'Méthode non autorisée' });

    } catch (err) {
        console.error(err);
        if (err.message.includes('token') || err.message.includes('Token')) {
            return res.status(401).json({ message: err.message });
        }
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Inscrit non trouvé' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
