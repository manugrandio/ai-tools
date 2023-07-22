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
}