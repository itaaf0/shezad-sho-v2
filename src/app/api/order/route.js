// src/app/api/order/route.js

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

/**
 * একটি নতুন অর্ডার ডেটাবেসে সংরক্ষণের জন্য POST রুট হ্যান্ডলার।
 */
export async function POST(request) {
  // ১. ডেটাবেসের সাথে সংযোগ স্থাপন
  await dbConnect();
  
  try {
    // ২. রিকোয়েস্ট বডি থেকে ডেটা পার্স করা
    const body = await request.json();
    
    // ৩. নতুন অর্ডার ইনস্ট্যান্স তৈরি ও সেভ করা
    const newOrder = await Order.create(body);

    // ৪. সফলভাবে সেভ হলে JSON রেসপন্স রিটার্ন
    return NextResponse.json({ 
      success: true, 
      data: newOrder 
    }, { status: 201 }); // 201 Created

  } catch (error) {
    // ৫. কোনো ত্রুটি হলে তা হ্যান্ডেল করা
    console.error('Error saving order:', error);
    
    // ত্রুটি বার্তা সহ JSON রেসপন্স রিটার্ন
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create order',
      error: error.message 
    }, { status: 400 }); // 400 Bad Request
  }
}