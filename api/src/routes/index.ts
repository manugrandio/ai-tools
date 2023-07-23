import { Router, RequestHandler, Request, Response } from "express";
import { TranscriptionController } from "modules/transcription.controller";

const msgReceived = async (_: Request, res: Response) => {
  console.log('MSG RECEIVED');
  res.status(201).send({ "msg": "hello world" });
};

const transcriptionController = new TranscriptionController();

const routes = Router();

routes.get("/msg-received", msgReceived as RequestHandler);
routes.post("/transcription", transcriptionController.create.bind(transcriptionController) as RequestHandler);

export default routes;
