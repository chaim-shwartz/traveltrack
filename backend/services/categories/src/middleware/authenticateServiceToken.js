const { verifyToken } = require('../utils/jwtUtils');

const authenticateServiceToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const service = verifyToken(token);
    if (!service) {
        return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }

    req.service = service;
    next();
};

module.exports = authenticateServiceToken;