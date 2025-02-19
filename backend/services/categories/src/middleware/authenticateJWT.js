const { verifyToken } = require('../utils/jwtUtils');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const user = verifyToken(token);
    if (!user) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = user;
    next();
};

module.exports = authenticateJWT;