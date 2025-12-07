// src/models/Order.js

import mongoose from 'mongoose';

// 1. Order Item Schema (অর্ডারের প্রতিটি প্রোডাক্ট)
const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    variantName: { type: String, required: false }, // যেমন: Red / L
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true }, 
    imageUrl: { type: String, required: false },
}, { _id: false });

// 2. Shipping/Customer Info Schema (গ্রাহকের ও ডেলিভারি তথ্য)
const ShippingInfoSchema = new new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }, // এটি ফ্রন্টএন্ড থেকে নিতে হবে
    email: { type: String, required: false },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    deliveryMethod: { type: String, required: false, default: 'Standard' },
    courierName: { type: String, required: false },
    trackingCode: { type: String, required: false },
}, { _id: false });

// 3. Payment Info Schema (পেমেন্টের বিবরণ)
const PaymentInfoSchema = new mongoose.Schema({
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: 'unpaid' }, // unpaid, paid, failed, refunded
    transactionId: { type: String, required: false },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed, required: false }, 
}, { _id: false });


// 4. Main Order Schema
const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: [true, 'Order ID is required'],
        unique: true, 
    },
    userId: { type: String, required: false, default: null },
    
    // আর্থিক বিবরণ
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    
    // স্ট্যাটাস
    orderStatus: { // pending, confirmed, processing, shipped, delivered, cancelled
        type: String,
        default: 'pending',
    },
    
    // নেস্টেড ডেটা (এম্বেডিং)
    orderItems: { type: [OrderItemSchema], required: true },
    shippingInfo: { type: ShippingInfoSchema, required: true },
    paymentDetails: { type: PaymentInfoSchema, required: true },

    notes: { type: String, required: false },
    ipAddress: { type: String, required: false },
    deviceInfo: { type: String, required: false },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;