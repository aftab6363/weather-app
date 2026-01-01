import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myDBTest";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Fail after 5 seconds if cannot connect
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("✅ New MongoDB Connection Established");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
