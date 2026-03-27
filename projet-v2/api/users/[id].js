const connectDB = require('../../lib/db');
const User = require('../../lib/User');
const verifyToken = require('../../lib/auth');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'DELETE') return res.status(405).json({ message: 'Méthode non autorisée' });

    try {
        const currentUser = verifyToken(req);
        await connectDB();

        const { id } = req.query;

        if (id === currentUser.id) {
            return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        await user.deleteOne();
        res.json({ message: 'Utilisateur supprimé' });

    } catch (err) {
        console.error(err);
        if (err.message.includes('token') || err.message.includes('Token')) {
            return res.status(401).json({ message: err.message });
        }
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
