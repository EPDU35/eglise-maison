const bcrypt = require('bcryptjs');
const connectDB = require('../../lib/db');
const User = require('../../lib/User');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });

    try {
        await connectDB();

        let user = await User.findOne({ identifiant: 'regioaké' });
        if (user) {
            return res.status(400).json({ message: 'Utilisateur par défaut déjà créé' });
        }

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
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
