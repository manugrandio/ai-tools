import client, { Connection, Channel } from "amqplib";

const QUEUE_NAME = "generateSummary";

export const addToQueue = async (uuid: string, content: string) => {
  const username = process.env.RABBITMQ_USERNAME;
  const password = process.env.RABBITMQ_PASSWORD;
  const port = process.env.RABBITMQ_PORT;
  const connectionStr = `amqp://${username}:${password}@rabbitmq:${port}`;
  const connection: Connection = await client.connect(connectionStr);

  const channel: Channel = await connection.createChannel()
  await channel.assertQueue(QUEUE_NAME);
  const message = JSON.stringify({ uuid, content });
  channel.sendToQueue(QUEUE_NAME, Buffer.from(message));

  setTimeout(() => {
    connection.close();
  }, 500);
};
