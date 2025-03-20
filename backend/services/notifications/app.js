require("dotenv").config();
const express = require("express");
const notificationsRoutes = require("./src/routes/notificationsRoutes");

const app = express();
app.use(express.json());

app.use("/api/notifications", notificationsRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`🚀 Notifications Service running on http://localhost:${PORT}`);
});