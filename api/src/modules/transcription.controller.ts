import { NextFunction, Request, Response } from "express";
import { instanceToPlain } from "class-transformer";
import { TranscriptionService } from "./transcription.service";

export class TranscriptionController {
  private readonly transcriptionService: TranscriptionService;

  constructor() {
    this.transcriptionService = new TranscriptionService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const createTranscriptionDto = { content: req.body.content };
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

  public async update(req: Request, res: Response, next: NextFunction) {
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
