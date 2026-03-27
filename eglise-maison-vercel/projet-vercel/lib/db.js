const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log('✅ MongoDB connecté');
}

module.exports = connectDB;
