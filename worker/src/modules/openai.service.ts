import { Configuration, OpenAIApi } from "openai";

const PROMPT = "You will be provided with an audio transcription, and your task is to summarize it";

export class OpenAIService {
  private readonly openai;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  public async summarizeText(text: string) {
    return await this.openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          "role": "system",
          "content": PROMPT,
        },
        {
          "role": "user",
          "content": text,
        }
      ],
      temperature: 0,
      max_tokens: 1024,
    });
  }
}