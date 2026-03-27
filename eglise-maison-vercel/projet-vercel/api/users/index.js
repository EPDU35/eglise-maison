const bcrypt = require('bcryptjs');
const connectDB = require('../../lib/db');
const User = require('../../lib/User');
const verifyToken = require('../../lib/auth');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        verifyToken(req);
        await connectDB();

        // GET - Tous les utilisateurs
        if (req.method === 'GET') {
            const users = await User.find().select('-password').sort({ dateCreation: -1 });
            return res.json(users);
        }

        // POST - Créer un utilisateur
        if (req.method === 'POST') {
            const { identifiant, password, role } = req.body;

            let user = await User.findOne({ identifiant });
            if (user) {
                return res.status(400).json({ message: 'Cet identifiant existe déjà' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({ identifiant, password: hashedPassword, role: role || 'admin' });
            await user.save();

            return res.json({
                id: user.id,
                identifiant: user.identifiant,
                role: user.role,
                dateCreation: user.dateCreation
            });
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
