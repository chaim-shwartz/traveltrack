const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "trips-service",
    brokers: [process.env.KAFKA_BROKER || "kafka:9092"], 
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