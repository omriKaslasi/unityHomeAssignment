const express = require('express');
const axios = require('axios');

// Api Server
const apiSvc = process.env.KAFKA_SVC || "api-server-svc.api-server.svc.cluster.local:3001";
userId = 0

// Kafka
const { Kafka } = require('kafkajs')
process.env.KAFKAJS_NO_PARTITIONER_WARNING=1

const topic = "purchases"
const kafkaSvc = process.env.KAFKA_SVC || "kafka.kafka.svc.cluster.local:9092";
const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: [kafkaSvc],
  ssl: false,
})
const producer = kafka.producer()
producer.connect()

// express app
const app = express();
const port = process.env.PORT || 3000;
app.listen(port);

// register view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.get('/shop', (req, res) => {
  res.render('shop');
})

app.get('/history', (req, res) => {
  const userID = userId;
  console.log("Fetching history for user " + userID)
  axios.get(`http://${apiSvc}/history/${userID}`)
    .then((result) => {
      res.render('history', {purchaseHistory: result.data});
    })
    .catch((err) => {
      console.log(err)
    })
})

app.post('/changeUserID', (req, res) => {
  userId = req.body.userID
  res.redirect('/')
})

app.post('/purchase', (req, res) => {
  purchaseRequest = req.body
  purchaseRequest.user_id = userId
  console.log("Sending purchase request to Kafka, purchase request: " + purchaseRequest)
  producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(purchaseRequest) }],
  })

  res.redirect('/shop')
})

app.use((req, res) => {
  res.status(404).render('404')
})