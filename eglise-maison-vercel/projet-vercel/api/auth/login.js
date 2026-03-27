const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../../lib/db');
const User = require('../../lib/User');
const setCors = require('../../lib/cors');

module.exports = async (req, res) => {
    setCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });

    try {
        await connectDB();

        const { identifiant, password } = req.body;

        const user = await User.findOne({ identifiant });
        if (!user) {
            return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect' });
        }

        const payload = {
            user: {
                id: user.id,
                identifiant: user.identifiant,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                identifiant: user.identifiant,
                role: user.role,
                dateCreation: user.dateCreation
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
