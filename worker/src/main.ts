import http from 'http';
import client, { Connection, Channel, Message } from 'amqplib/callback_api';

console.log("WORKER STARTED");

client.connect('amqp://username:password@rabbitmq:5672', (error0: any, connection: Connection) => {
  if (error0) {
    console.log("ERROR CONNECT", error0);
  }
  connection.createChannel((error1: any, channel: Channel) => {
    if (error1) {
      throw error1;
    }
    const queueName = 'testQueue';
    channel.assertQueue(queueName);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    channel.consume(queueName, async (msg: Message | null) => {
      console.log("CONSUMED");
      if (msg) {
        console.log(" [x] Received %s", msg.content.toString());
        channel.ack(msg);

        await http.get('http://main:3000/api/msg-received');
      }
    });
  });
});
