const http = require('http');
const mongoose = require('mongoose');
const express = require('express');

// Initialize Express application
const app = express();
app.use(express.urlencoded({ extended: true }))
const historyRoutes = require('./api/history');
app.use('/history', historyRoutes);


// Create HTTP server with the express app
const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Kafka
console.log("Attempting connection to Kafka")
const consumer = require('./consumer')

// MongoDB connection setup
const mongoUser = process.env.MONGO_USER || "app";
const mongoPass = process.env.MONGO_PASS || "app123";
const mongoSvc = process.env.MONGO_SVC || "my-mongodb-svc.mongodb.svc.cluster.local";
const dbURI = `mongodb://${mongoUser}:${mongoPass}@${mongoSvc}:27017/store?directConnection=true&serverSelectionTimeoutMS=2000`;

console.log("Attempting connection to mongo")
mongoose.connect(dbURI)
  .then((result) => server.listen(port))
  .catch((err) => console.log(err))