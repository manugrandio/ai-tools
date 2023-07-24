import { Router, RequestHandler } from "express";
import { TranscriptionController } from "modules/transcription.controller";

const transcriptionController = new TranscriptionController();

const routes = Router();

routes.post("/transcription", transcriptionController.create.bind(transcriptionController) as RequestHandler);
routes.get(
  "/transcription/:transcriptionUUID",
  transcriptionController.get.bind(transcriptionController) as RequestHandler
);
routes.put(
  "/transcription/:transcriptionUUID",
  transcriptionController.update.bind(transcriptionController) as RequestHandler
);

export default routes;
