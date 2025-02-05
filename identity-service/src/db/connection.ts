import mongoose from 'mongoose';
import { config, logger } from '../utils';
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        logger.info("Database Connected.")
    } catch (error) {
        logger.error("Database Connection Error", error);
        process.exit(1);
    }
};

export default connectDB;