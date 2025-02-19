require('dotenv').config();
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const connectDB = require('./src/config/mongo');
const { initGridFS } = require('./src/config/gridfs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests only from your frontend
    credentials: true, // Allow sending cookies
};
app.use(cors(corsOptions));


connectDB();
initGridFS();

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);



// Start the server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`User Service running on http://localhost:${PORT}`);
});