const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const purchaseHistorySchema = new Schema({
  user_id: {
    type: Number,
    default: 1
  },
  purchaseAmount: {
    type: Number,
    required: true
  },
  flowerName: {
    type: String,
    required: true
  },
}, { timestamps: true });

const PurchaseHistory = mongoose.model('purchasehistories', purchaseHistorySchema)
module.exports = PurchaseHistory;