const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

// // Generate Service Token
// const generateServiceToken = (serviceName) => {
//     return jwt.sign({ service: serviceName }, process.env.SERVICE_SECRET, { expiresIn: '1h' });
// };

// Verify Service Token
// const verifyServiceToken = (token) => {
//     try {
//         return jwt.verify(token, process.env.SERVICE_SECRET);
//     } catch (err) {
//         return null;
//     }
// };

module.exports = { generateToken, verifyToken };