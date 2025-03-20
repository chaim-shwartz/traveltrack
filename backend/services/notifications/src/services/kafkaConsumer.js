const { Kafka } = require("kafkajs");
const Notification = require("../models/Notification");

const kafka = new Kafka({
    clientId: "notifications-service",
    brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "notifications-group" });

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "trip-user-added", fromBeginning: true });

    console.log("📡 Waiting for messages from Kafka...");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`📩 Raw message received from Kafka: ${message.value.toString()}`);

            try {
                const data = JSON.parse(message.value.toString());
                console.log("📌 Parsed message:", data);

                await Notification.query().insert({
                    user_id: data.userId,
                    message: `You have been added to trip ${data.tripId}`,
                    trip_id: data.tripId,
                });

                console.log(`✅ Notification added for user ${data.userId}`);
            } catch (error) {
                console.error("❌ Error processing message:", error);
            }
        },
    });
};

runConsumer().catch(console.error);