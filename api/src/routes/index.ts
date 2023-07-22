import { Router, RequestHandler, Request, Response } from "express";
import client, { Connection, Channel } from "amqplib";
import { TranscriptionController } from "modules/transcription.controller";

const helloWorld = async (_: Request, res: Response) => {
  const connection: Connection = await client.connect(
    'amqp://username:password@rabbitmq:5672'
  )

  const channel: Channel = await connection.createChannel()
  await channel.assertQueue('testQueue');
  channel.sendToQueue('testQueue', Buffer.from('hello world from queue'));

  setTimeout(() => {
    connection.close();
  }, 500);

  res.status(201).send({ "msg": "hello world" });
};

const msgReceived = async (_: Request, res: Response) => {
  console.log('MSG RECEIVED');
  res.status(201).send({ "msg": "hello world" });
};

const transcriptionController = new TranscriptionController();

const routes = Router();

routes.get("/hello-world", helloWorld as RequestHandler);
routes.get("/msg-received", msgReceived as RequestHandler);
routes.post("/transcription", transcriptionController.create.bind(transcriptionController) as RequestHandler);

export default routes;
