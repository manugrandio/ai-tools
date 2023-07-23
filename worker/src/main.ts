import http from 'http';
import client, { Connection, Channel, Message } from 'amqplib/callback_api';

console.log("WORKER STARTED");

const QUEUE_NAME = "generateSummary";

client.connect('amqp://username:password@rabbitmq:5672', (error0: any, connection: Connection) => {
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
      console.log("CONSUMED");
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        console.log(" [x] Received %s", content);
        channel.ack(msg);

        await http.get('http://main:3000/api/msg-received');
      }
    });
  });
});
