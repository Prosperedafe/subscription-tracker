import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI) {
    throw new Error('DB_URI is not defined');
}

mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        const conn = await mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        await new Promise((resolve) => {
            if (conn.connection.readyState === 1) {
                resolve();
            } else {
                conn.connection.once('connected', resolve);
            }
        });

    } catch (error) {
        // console.error('MongoDB connection error:', error.message);
        // console.error('DB_URI:', DB_URI ? 'Set' : 'Not set');
        if (error.name === 'MongoServerSelectionError') {
            // console.error('Unable to connect to MongoDB server. Please check:');
            // console.error('1. MongoDB server is running');
            // console.error('2. Connection string is correct');
            // console.error('3. Network/firewall allows connection');
        }
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

export default connectDB 
