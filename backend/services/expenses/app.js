// const express = require('express');
// const expensesRoutes = require('./src/routes/expensesRoutes');
// const authenticateJWT = require('./src/middleware/authenticateJWT');

// const app = express();

// const corsOptions = {
//     origin: 'http://localhost:5173', // Allow requests only from your frontend
//     credentials: true, // Allow sending cookies
// };
// app.use(cors(corsOptions));


// app.use(express.json());

// // Routes
// app.use('/expenses', authenticateJWT, expensesRoutes);


require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const expensesRoutes = require('./src/routes/expensesRoutes');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests only from your frontend
    credentials: true, // Allow sending cookies
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/api/expenses', expensesRoutes);


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Expenses service running on port ${PORT}`);
});
