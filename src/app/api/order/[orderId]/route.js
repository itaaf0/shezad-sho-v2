// src/app/api/order/[orderId]/route.js

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

/**
 * একটি নির্দিষ্ট অর্ডার আইডি দ্বারা অর্ডার ডেটা পাওয়ার জন্য GET রুট হ্যান্ডলার।
 * @param {object} request - Next.js Request object
 * @param {object} context - Route context containing params
 */
export async function GET(request, context) {
    await dbConnect();

    try {
        // ডাইনামিক রুট প্যারামিটার থেকে orderId নেওয়া হচ্ছে
        const { orderId } = context.params;

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
        }

        // MongoDB তে orderId খুঁজে বের করা
        // আমরা এখানে orderId: orderId দিয়ে খুঁজছি, কারণ আমাদের স্কিমাতে orderId ফিল্ড আছে।
        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        // সফলভাবে অর্ডার পেলে তা রিটার্ন
        return NextResponse.json({ 
            success: true, 
            data: order 
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        }, { status: 500 });
    }
}