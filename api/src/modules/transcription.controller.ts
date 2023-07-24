import { NextFunction, Request, Response } from "express";
import { instanceToPlain } from "class-transformer";
import { TranscriptionService } from "./transcription.service";
import { RequestCreate, RequestUpdate } from "./interfaces";

export class TranscriptionController {
  private readonly transcriptionService: TranscriptionService;

  constructor() {
    this.transcriptionService = new TranscriptionService();
  }

  public async create(req: RequestCreate, res: Response, next: NextFunction) {
    const content = req.body.content;
    const createTranscriptionDto = { content };
    try {
      const transcription = await this.transcriptionService.create(createTranscriptionDto);
      const plainTranscription = instanceToPlain(transcription);
      res.status(201).send(plainTranscription);
    } catch (error) {
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    const { transcriptionUUID: uuid } = req.params;
    try {
      const transcription = await this.transcriptionService.get(uuid);
      const plainTranscription = instanceToPlain(transcription);
      res.status(201).send(plainTranscription);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: RequestUpdate, res: Response, next: NextFunction) {
    const { transcriptionUUID: uuid } = req.params;
    const updateTranscriptionDto = {
      uuid,
      summary: req.body.summary,
      status: req.body.status,
    };
    try {
      await this.transcriptionService.update(updateTranscriptionDto);
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
}
