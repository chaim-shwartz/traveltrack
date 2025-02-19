require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const categoriesRoutes = require('./src/routes/categoriesRoutes');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests only from your frontend
    credentials: true, // Allow sending cookies
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use('/api/categories', categoriesRoutes);

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Categories Service running on http://localhost:${PORT}`);
});