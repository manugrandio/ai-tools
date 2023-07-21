import { Router, RequestHandler, Request, Response } from "express";
import client, { Connection, Channel } from "amqplib";

const helloWorld = async (_: Request, res: Response) => {
  const connection: Connection = await client.connect(
    'amqp://username:password@rabbitmq:5672'
  )

  const channel: Channel = await connection.createChannel()
  await channel.assertQueue('testQueue');
  channel.sendToQueue('testQueue', Buffer.from('hello world from queue'));
  connection.close();

  res.status(201).send({ "msg": "hello world" });
};

const routes = Router();

routes.get("/hello-world", helloWorld as RequestHandler);

export default routes;
