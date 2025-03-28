require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const http = require("http");
const cors = require('cors');
const notificationsRoutes = require("./src/routes/notificationsRoutes");
const { Server } = require("socket.io");

const app = express();
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests only from your frontend
    credentials: true, // Allow sending cookies
};
app.use(cors(corsOptions));

const server = http.createServer(app); // Create a single HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allows connection from the frontend
        methods: ["GET", "POST"]
    }
});

const userSockets = new Map(); // Map של משתמשים והחיבורים שלהם

io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("register", (userId) => {
        console.log(`🔗 User ${userId} registered with socket ${socket.id}`);
        userSockets.set(userId, socket.id); // Storing the connection between the user and the socket
    });

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
        for (let [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                break;
            }
        }
    });
});

require("./src/services/kafkaConsumer")(io, userSockets);

app.use(express.json());
app.use("/api/notifications", notificationsRoutes);

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => { // Listening on the same Express server
    console.log(`🚀 Notifications Service running on http://localhost:${PORT}`);
});
