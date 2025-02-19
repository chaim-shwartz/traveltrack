const authenticateJWT = require('./authenticateJWT'); // User JWT authentication
const authenticateServiceToken = require('./authenticateServiceToken');

// Combined middleware for both user and service authentication
const combinedAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Service Token in Authorization header
        return authenticateServiceToken(req, res, next);
    }
    // User JWT in cookies
    return authenticateJWT(req, res, next);
};

module.exports = { combinedAuth };