import { SummaryService } from "modules/summary.service";
import { APIService } from "modules/api.service"
import { OpenAIService }from "modules/openai.service"

describe("SummaryService", () => {
  let openAiService: OpenAIService;
  let apiService: APIService;
  let setToProcessingMock: jest.SpyInstance;
  let setToCompletedMock: jest.SpyInstance;
  let setToErrorMock: jest.SpyInstance;
  let summarizeTextMock: jest.SpyInstance;

  beforeEach(() => {
    apiService = new APIService();
    setToProcessingMock = jest.spyOn(apiService, "setToProcessing")
      .mockImplementation(() => Promise.resolve(undefined));
    setToCompletedMock = jest.spyOn(apiService, "setToCompleted")
      .mockImplementation(() => Promise.resolve(undefined));
    setToErrorMock = jest.spyOn(apiService, "setToError")
      .mockImplementation(() => Promise.resolve(undefined));

    openAiService = new OpenAIService();
  });

  afterEach(() => {
    setToProcessingMock.mockRestore();
    setToCompletedMock.mockRestore();
    setToErrorMock.mockRestore();
    summarizeTextMock.mockRestore();
  });

  describe(".generateSummary", () => {
    it("should generate a text summary and set it to completed if success", async () => {
      summarizeTextMock = jest.spyOn(openAiService, "summarizeText")
        .mockImplementation(() => Promise.resolve("summarized text"));
      const summaryService = new SummaryService(openAiService, apiService)
      const text = "this is a long text that should be summarized"
      const uuid = "transcription-uuid"

      await summaryService.generateSummary(text, uuid);

      expect(setToProcessingMock.mock.calls).toHaveLength(1);
      expect(setToCompletedMock.mock.calls).toHaveLength(1);
      expect(setToErrorMock.mock.calls).toHaveLength(0);
    });

    it("should generate a text summary and set it to error if failure", async () => {
      summarizeTextMock = jest.spyOn(openAiService, "summarizeText")
        .mockImplementation(() => Promise.reject(new Error("Summary error")));
      const summaryService = new SummaryService(openAiService, apiService)
      const text = "this is a long text that should be summarized"
      const uuid = "transcription-uuid"

      await summaryService.generateSummary(text, uuid);

      expect(setToProcessingMock.mock.calls).toHaveLength(1);
      expect(setToCompletedMock.mock.calls).toHaveLength(0);
      expect(setToErrorMock.mock.calls).toHaveLength(1);
    });
  });
});
