import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config, logger } from './utils';
import { FileRouter } from './routes/file-route';
const app = express();

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
app.use('/api/file', FileRouter);

