import client, { Connection, Channel } from "amqplib";
import config from "config/config";

const QUEUE_NAME = "generateSummary";

export const addToQueue = async (uuid: string, content: string) => {
  const username = config.RABBITMQ_USERNAME;
  const password = config.RABBITMQ_PASSWORD;
  const port = config.RABBITMQ_PORT;
  const connectionStr = `amqp://${username}:${password}@rabbitmq:${port}`;
  const connection: Connection = await client.connect(connectionStr);

  const channel: Channel = await connection.createChannel()
  await channel.assertQueue(QUEUE_NAME);
  const message = JSON.stringify({ uuid, content });
  console.log("SENDING TO QUEUE");
  await channel.sendToQueue(QUEUE_NAME, Buffer.from(message));

  setTimeout(() => {
    connection.close();
  }, 500);

  console.log("FINISHED SENDING TO QUEUE");
};
