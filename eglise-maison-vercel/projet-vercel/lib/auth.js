const jwt = require('jsonwebtoken');

function verifyToken(req) {
    const token = req.headers['x-auth-token'];
    if (!token) throw new Error('Accès refusé, pas de token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
}

module.exports = verifyToken;
