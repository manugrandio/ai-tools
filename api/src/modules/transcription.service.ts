import crypto from "crypto";
import { DeepPartial, Repository } from "typeorm";
import dataSource from "orm/orm.config";
import { CreateTranscriptionDto } from "./transcription.dto";
import { Transcription } from "./entities/transcription.entity";
import { addToQueue } from "./rabbitmq.service";

export class TranscriptionService {
  private readonly transcriptionRepository: Repository<Transcription>;

  constructor() {
    this.transcriptionRepository = dataSource.getRepository(Transcription);
  }

  public async save(content: string, hash: string): Promise<Transcription> {
    const transcriptionData: DeepPartial<Transcription> = { content, hash };

    const newTranscription = this.transcriptionRepository.create(transcriptionData);
    return await this.transcriptionRepository.save(newTranscription);
  }

  public async create(data: CreateTranscriptionDto): Promise<Transcription> {
    const { content } = data;
    const hash = this.calculateHash(content);
    
    const existingTranscription = await this.findTranscription(hash);
    if (existingTranscription) {
      return existingTranscription;
    }

    const transcription = await this.save(content, hash);
    await addToQueue(transcription.uuid, transcription.content);

    return transcription;
  }

  public async findTranscription(hash: string): Promise<Transcription | null> {
    return this.transcriptionRepository.findOneBy({ hash });
  }

  public calculateHash(content: string): string {
    return crypto.createHash("md5").update(content).digest("hex");
  }
}