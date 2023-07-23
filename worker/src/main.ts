import client, { Connection, Channel, Message } from 'amqplib/callback_api';
import { SummaryService } from 'modules/summary.service';

const QUEUE_NAME = "generateSummary";
const username = process.env.RABBITMQ_USERNAME;
const password = process.env.RABBITMQ_PASSWORD;
const port = process.env.RABBITMQ_PORT;
const connectionStr = `amqp://${username}:${password}@rabbitmq:${port}`;

client.connect(connectionStr, (error0: any, connection: Connection) => {
  if (error0) {
    console.log("ERROR CONNECT", error0);
  }
  connection.createChannel((error1: any, channel: Channel) => {
    if (error1) {
      throw error1;
    }
    channel.assertQueue(QUEUE_NAME);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE_NAME);
    channel.consume(QUEUE_NAME, async (msg: Message | null) => {
      if (msg) {
        const msgContent = JSON.parse(msg.content.toString());
        console.log(" [x] Received %s", msgContent);

        const { content, uuid } = msgContent;
        const summaryService = new SummaryService();
        await summaryService.generateSummary(content, uuid);

        channel.ack(msg);
      }
    });
  });
});
