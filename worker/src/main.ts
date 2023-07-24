import client, { Connection, Channel, Message } from "amqplib/callback_api";
import { RabbitmqMessage } from "modules/interfaces";
import { SummaryService } from "modules/summary.service";

const QUEUE_NAME = "generateSummary";
const username = process.env.RABBITMQ_USERNAME;
const password = process.env.RABBITMQ_PASSWORD;
const port = process.env.RABBITMQ_PORT;
const connectionStr = `amqp://${username}:${password}@rabbitmq:${port}`;
const RABBITMQ_MAX_MESSAGES = process.env.RABBITMQ_MAX_MESSAGES ? Number(process.env.RABBITMQ_MAX_MESSAGES) : 5;
const MILLISECONDS_FOR_MAX_MESSAGES = 1000;

client.connect(connectionStr, (error0: any, connection: Connection) => {
  if (error0) {
    console.log("ERROR CONNECT", error0);
  }

  connection.createChannel((error1: any, channel: Channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(QUEUE_NAME);
    channel.prefetch(RABBITMQ_MAX_MESSAGES);
    channel.consume(QUEUE_NAME, (msg: Message | null) => {
      if (msg) {
        const msgContent = JSON.parse(msg.content.toString()) as RabbitmqMessage;
        console.log("RECEIVED", msgContent);

        const { content, uuid } = msgContent;
        const summaryService = new SummaryService();
        Promise.all([
          summaryService.generateSummary(content, uuid),
          // Ack the message after a time out to rate limit message processing
          // in order to respect OpenAI requests/second
          new Promise(resolve => {
            setTimeout(() => resolve(null), MILLISECONDS_FOR_MAX_MESSAGES);
            channel.ack(msg);
          }),
        ]);
      }
    });
  });
});
