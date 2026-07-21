const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scholarconnect';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: Host ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error]: ${error.message}`);
    console.warn(`[MongoDB Warning]: Server will continue running, but database operations require a running MongoDB instance at ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scholarconnect'}`);
  }
};

module.exports = connectDB;
