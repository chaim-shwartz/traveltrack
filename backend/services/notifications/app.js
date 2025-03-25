require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require('cors');
const notificationsRoutes = require("./src/routes/notificationsRoutes");
const { Server } = require("socket.io");

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests only from your frontend
    credentials: true, // Allow sending cookies
};
app.use(cors(corsOptions));

const server = http.createServer(app); // יצירת שרת HTTP אחד
const io = new Server(server, {
    cors: {
        origin: "*", // מאפשר חיבור מהפרונטנד
        methods: ["GET", "POST"]
    }
});

const userSockets = new Map(); // Map של משתמשים והחיבורים שלהם

io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("register", (userId) => {
        console.log(`🔗 User ${userId} registered with socket ${socket.id}`);
        userSockets.set(userId, socket.id); // שמירת קשר בין המשתמש לחיבור
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

server.listen(PORT, () => { // מאזין על אותו שרת של Express
    console.log(`🚀 Notifications Service running on http://localhost:${PORT}`);
});