import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT!,
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET!,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET!,
  MONGO_URI: process.env.MONGO_URI!,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS!),
  RABBITMQ_URL: process.env.RABBITMQ_URL!
};