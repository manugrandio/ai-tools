import { tearDownDatabase } from "helpers/utils";
import { Transcription } from "modules/entities/transcription.entity";
import { CreateTranscriptionDto, UpdateTranscriptionDto } from "modules/transcription.dto";
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

  describe(".get", () => {
    it("should return transcription", async () => {
      const createTranscriptionDto: CreateTranscriptionDto = {
        content: "the content of some transcription",
      };
      const transcriptionService = new TranscriptionService();
      const transcriptionCreated = await transcriptionService.create(createTranscriptionDto);

      const transcription = await transcriptionService.get(transcriptionCreated.uuid);

      expect(transcription).toBeInstanceOf(Transcription);
      expect(transcription?.uuid).toEqual(transcriptionCreated.uuid);
    });
  });

  describe(".update", () => {
    it("should update transcription", async () => {
      const createTranscriptionDto: CreateTranscriptionDto = {
        content: "the content of some transcription",
      };
      const transcriptionService = new TranscriptionService();
      const transcriptionCreated = await transcriptionService.create(createTranscriptionDto);

      const updateTranscriptionDto: UpdateTranscriptionDto = {
        uuid: transcriptionCreated.uuid,
        summary: "this is the summary",
        status: "completed",
      };
      await transcriptionService.update(updateTranscriptionDto);

      const transcription = await transcriptionService.get(transcriptionCreated.uuid);

      expect(transcription?.summary).toEqual("this is the summary");
      expect(transcription?.status).toEqual("completed");
    });
  });
});