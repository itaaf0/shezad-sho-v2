// src/models/Order.js

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true, // নিশ্চিত করবে যে প্রতিটি অর্ডারের আইডি আলাদা
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
  },
  // Mongoose স্বয়ংক্রিয়ভাবে এই ফিল্ডটি তৈরি করবে
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Mongoose-এ মডেলটি বারবার সংজ্ঞায়িত হওয়া এড়াতে এই লজিক ব্যবহার করা হয়।
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;