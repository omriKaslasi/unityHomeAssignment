const PurchaseHistory = require('./api/purchasehistory');
const { Kafka } = require('kafkajs');
process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1;

// Kafka service address from environment variable
const kafkaSvc = process.env.KAFKA_SVC || "kafka.kafka.svc.cluster.local:9092";

// Kafka client configuration
const kafka = new Kafka({
  clientId: 'my-consumer',
  ssl: false,
  brokers: [kafkaSvc]
});

// Kafka consumer configuration
const consumer = kafka.consumer({ groupId: 'consumer-group' });
const topic = "purchases";

// Run the Kafka consumer
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  // Process each received message
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Received message " + JSON.parse(message.value.toString())); 
      const purchase = new PurchaseHistory(JSON.parse(message.value.toString())); 
      purchase.save()
        .catch((err) => {
          console.log(err);
        });
    },
  });
}

// Run the consumer and catch any errors
run().catch(console.error);

module.exports = consumer;