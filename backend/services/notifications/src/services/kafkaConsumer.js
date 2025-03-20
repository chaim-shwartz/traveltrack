const { Kafka } = require("kafkajs");
const Notification = require("../models/Notification");

module.exports = (io) => { // נוסיף את io כדי שנוכל לשדר הודעות
    const kafka = new Kafka({
        clientId: "notifications-service",
        brokers: ["kafka:9092"],
    });

    const consumer = kafka.consumer({ groupId: "notifications-group" });

    const runConsumer = async () => {
        await consumer.connect();
        await consumer.subscribe({ topic: "trip-user-added", fromBeginning: false });

        console.log("📡 Waiting for messages from Kafka...");

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`📩 Raw message received from Kafka: ${message.value.toString()}`);

                try {
                    const data = JSON.parse(message.value.toString());
                    console.log("📌 Parsed message:", data);

                    const notification = await Notification.query().insert({
                        user_id: data.userId,
                        message: `You have been added to trip ${data.tripId}`,
                        trip_id: data.tripId,
                    });

                    console.log(`✅ Notification added for user ${data.userId}`);

                    // 🔥 שולח את ההתראה לכל הלקוחות המחוברים
                    io.emit("new-notification", {
                        user_id: data.userId,
                        message: notification.message,
                        trip_id: notification.trip_id,
                    });
                } catch (error) {
                    console.error("❌ Error processing message:", error);
                }
            },
        });
    };

    runConsumer().catch(console.error);
};