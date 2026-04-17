import mongoose from 'mongoose';
import { getEnv } from './env.js';

export async function connectDb() {
  const uri = getEnv('MONGODB_URI');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
  });

  return mongoose.connection;
}

