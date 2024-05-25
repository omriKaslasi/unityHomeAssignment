const express = require('express');
const PurchaseHistory = require('./purchasehistory')
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(400).json({
    message: "NO USER ID!"
  });
})

router.get('/:userID', (req, res) => {
  const user_id = req.params.userID;
  PurchaseHistory.find({ user_id: user_id })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router;