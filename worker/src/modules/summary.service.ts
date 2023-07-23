import { OpenAIService } from 'modules/openai.service';
import { APIService } from './api.service';

export class SummaryService {
  private readonly openAIService: OpenAIService;
  private readonly apiService: APIService;

  constructor() {
    this.openAIService = new OpenAIService();
    this.apiService = new APIService();
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
