import { tearDownDatabase } from "helpers/utils";
import { Transcription } from "modules/entities/transcription.entity";
import { CreateTranscriptionDto } from "modules/transcription.dto";
import { TranscriptionService } from "modules/transcription.service";
import * as RabbitmqService from "modules/rabbitmq.service";
import ds from "orm/orm.config";

describe("TranscriptionService", () => {
  let addToQueueMock: jest.SpyInstance;

  beforeEach(async () => {
    await ds.initialize();
  });

  afterEach(async () => {
    await tearDownDatabase(ds);
  });

  beforeEach(() => {
    addToQueueMock = jest.spyOn(RabbitmqService, 'addToQueue');
  });

  afterEach(() => {
    addToQueueMock.mockRestore();
  });

  describe(".create", () => {
    it("should create transcription if it does not exist", async () => {
      const createTranscriptionDto: CreateTranscriptionDto = {
        content: "the content of some transcription",
      };
      const transcriptionService = new TranscriptionService();

      const transcription = await transcriptionService.create(createTranscriptionDto);

      expect(transcription).toBeInstanceOf(Transcription);
      expect(transcription.content).toEqual("the content of some transcription");
      expect(jest.mocked(addToQueueMock).mock.calls).toHaveLength(1);
    });

    it("should return existing transcription if the content's hash matches", async () => {
      const createTranscriptionDto: CreateTranscriptionDto = {
        content: "the content of some transcription",
      };
      const transcriptionService = new TranscriptionService();
      await transcriptionService.create(createTranscriptionDto);
      addToQueueMock.mockRestore();

      const transcription = await transcriptionService.create(createTranscriptionDto);

      expect(transcription).toBeInstanceOf(Transcription);
      expect(transcription.content).toEqual("the content of some transcription");
      expect(jest.mocked(addToQueueMock).mock.calls).toHaveLength(0);
    });
  });
});