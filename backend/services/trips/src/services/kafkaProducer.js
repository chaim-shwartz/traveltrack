const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "trips-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"], // כתובת הברוקר
});

const producer = kafka.producer();

const produceMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`✅ Message sent to topic "${topic}":`, message);
};

module.exports = { produceMessage };