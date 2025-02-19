require('dotenv').config();
const express = require('express');
const tripsRoutes = require('./src/routes/tripsRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests only from your frontend
    credentials: true, // Allow sending cookies
};
app.use(cors(corsOptions));

// Routes
app.use('/api/trips', tripsRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Trip Service running on http://localhost:${PORT}`);
});