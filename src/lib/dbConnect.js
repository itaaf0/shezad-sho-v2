// src/lib/dbConnect.js

import mongoose from 'mongoose';

// Environment variable থেকে কানেকশন স্ট্রিং নেওয়া হচ্ছে
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local or Netlify settings'
  );
}

// গ্লোবাল ক্যাচিংয়ের জন্য ভেরিয়েবল
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * ডেটাবেসের সাথে সংযোগ স্থাপনের জন্য ফাংশন।
 * এটি সংযোগটি গ্লোবালি ক্যাশ করে যাতে বারবার সংযোগ না হয়।
 */
async function dbConnect() {
  if (cached.conn) {
    // যদি ইতিমধ্যেই সংযুক্ত থাকে, ক্যাশ করা সংযোগটি রিটার্ন করা হবে
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // ডেটাবেস প্রস্তুত না হওয়া পর্যন্ত কমান্ড বাফার করবে না
    };

    // সংযোগ স্থাপন এবং প্রমিজ ক্যাশ করা
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // সংযোগ ব্যর্থ হলে প্রমিজটি রিসেট করা
    throw e;
  }

  return cached.conn;
}

export default dbConnect;