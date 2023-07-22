import { tearDownDatabase } from "helpers/utils";
import { Transcription } from "modules/entities/transcription.entity";
import { CreateTranscriptionDto } from "modules/transcription.dto";
import { TranscriptionService } from "modules/transcription.service";
import ds from "orm/orm.config";

describe("TranscriptionService", () => {
  beforeEach(async () => {
    await ds.initialize();
  });

  afterEach(async () => {
    await tearDownDatabase(ds);
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
    });
  });
});