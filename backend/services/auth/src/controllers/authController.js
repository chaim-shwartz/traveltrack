const { generateToken } = require("../utils/jwtUtils");

const googleLogin = (req, res) => {
    const { token } = req.user;
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
    }).redirect('http://localhost:5173');
};

// Generate a Service Token
const generateServiceToken = (req, res) => {
    try {
        // Extract service name from request body (e.g., 'expenses-service')
        const { serviceName } = req.body;                
        if (!serviceName) {
            return res.status(400).json({ error: 'Service name is required' });
        }

        // Generate the token
        const token = generateToken({serviceName: serviceName});
        res.json({ token });
    } catch (error) {
        console.error('Error generating service token:', error);
        res.status(500).json({ error: 'Failed to generate service token' });
    }
};

module.exports = { googleLogin, generateServiceToken };