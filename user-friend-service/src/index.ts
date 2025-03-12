import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config, logger } from './utils';
import connectDB from './db/connection';
import { AuthRouter, AvatarRouter, FriendRouter, RequestReceivedRouter, RequestSentRouter } from './routes';
import authMiddleware from '@middleware/authMiddleware';
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});


async function startServer() {
  try {

    // await connctRabbitMQ();

    // // Consume all events
    // await consumeEvent("friends.request-sent", handleRequestSent);

    app.listen(config.PORT, () => {
      logger.info(`Identity service running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to server", error);
    process.exit(1);
  }
}

startServer();

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/avatar', AvatarRouter);
app.use('/api/request-sent', authMiddleware, RequestSentRouter);
app.use('/api/request-received', authMiddleware, RequestReceivedRouter);
app.use('/api/friends', authMiddleware, FriendRouter);