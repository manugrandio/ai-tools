import { OpenAIService } from "modules/openai.service";
import { APIService } from "./api.service";

export class SummaryService {
  private readonly openAIService: OpenAIService;
  private readonly apiService: APIService;

  constructor(openAIService?: OpenAIService, apiService?: APIService) {
    this.openAIService = typeof openAIService === "undefined" ? new OpenAIService() : openAIService;
    this.apiService = typeof apiService === "undefined" ? new APIService() : apiService;
  }

  public async generateSummary(content: string, uuid: string): Promise<void> {
    await this.apiService.setToProcessing(uuid);
    let summary: string | undefined;
    try {
      summary = await this.openAIService.summarizeText(content);
    } catch {
      await this.apiService.setToError(uuid);
      return;
    }

    if (typeof summary !== "undefined") {
      await this.apiService.setToCompleted(uuid, summary);
    } else {
      await this.apiService.setToError(uuid);
    }
  }
}
