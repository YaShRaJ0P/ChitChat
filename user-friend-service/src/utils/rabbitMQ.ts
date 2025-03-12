import amqp from "amqplib";
import { config, logger } from ".";

let connection: any;
let channel: any;

const EXCHANGE_NAME = "facebook_events";
const QUEUE_NAME = "facebook_events_queue";

async function connectToRabbitMQ(retryCount = 5) {
    try {
        connection = await amqp.connect(config.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
        logger.info("Connected to RabbitMQ");

        connection.on("close", async () => {
            logger.warn("RabbitMQ connection closed, reconnecting...");
            setTimeout(() => connectToRabbitMQ(), 5000);
        });

        connection.on("error", (err: any) => {
            logger.error("RabbitMQ connection error", err);
        });

        return channel;
    } catch (e) {
        logger.error("Error connecting to RabbitMQ", e);
        if (retryCount > 0) {
            setTimeout(() => connectToRabbitMQ(retryCount - 1), 5000);
        }
    }
}

async function publishEvent(routingKey: string, message: string) {
    if (!channel) {
        await connectToRabbitMQ();
    }

    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
    logger.info(`Event published: ${routingKey}`);
}

async function consumeEvent(routingKey: string, callback: (msg: any) => Promise<void>) {
    if (!channel) {
        await connectToRabbitMQ();
    }

    const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);

    channel.consume(q.queue, async (msg) => {
        if (msg !== null) {
            try {
                const content = JSON.parse(msg.content.toString());
                await callback(content);
                channel.ack(msg);
            } catch (error) {
                logger.error("Error processing message", error);
                // Don't ack so the message can be retried
            }
        }
    });

    logger.info(`Subscribed to event: ${routingKey}`);
}

module.exports = { connectToRabbitMQ, publishEvent, consumeEvent };
