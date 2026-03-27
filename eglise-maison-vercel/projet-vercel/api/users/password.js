const bcrypt = require('bcryptjs');
const connectDB = require('../../lib/db');
const User = require('../../lib/User');
const verifyToken = require('../../lib/auth');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Méthode non autorisée' });

    try {
        const currentUser = verifyToken(req);
        await connectDB();

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(currentUser.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Le mot de passe actuel est incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Mot de passe modifié avec succès' });

    } catch (err) {
        console.error(err);
        if (err.message.includes('token') || err.message.includes('Token')) {
            return res.status(401).json({ message: err.message });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
