const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

function isAdmin(req, res, next) {
    if (req.user.nivel !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
}

module.exports = { verifyToken, isAdmin };