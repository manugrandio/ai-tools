import { Configuration, OpenAIApi } from "openai";

const PROMPT = "You will be provided with an audio transcription, and your task is to summarize it";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MAX_TOKENS = 1024;
const TEMPERATURE = 0;
const MODEL = "gpt-4";

export class OpenAIService {
  private readonly openai;

  constructor() {
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
    this.openai = new OpenAIApi(configuration);
  }

  public async summarizeText(text: string): Promise<string | undefined> {
    const response = await this.openai.createChatCompletion({
      model: MODEL,
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
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });
    
    const choices = response.data?.choices;
    const choice = choices && choices[0];
    return choice?.message?.content;
  }
}
