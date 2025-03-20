const { Kafka } = require("kafkajs");
const Notification = require("../models/Notification");

const kafka = new Kafka({
    clientId: "notifications-service",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "notifications-group" });

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "trip-user-added", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value.toString());

            await Notification.query().insert({
                user_id: data.userId,
                message: `You have been added to trip ${data.tripId}`,
                trip_id: data.tripId,
            });

            console.log(`📢 Notification added for user ${data.userId}`);
        },
    });
};

runConsumer().catch(console.error);