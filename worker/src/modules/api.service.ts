import axios from "axios";

const PROCESSING = "processing";
const COMPLETED = "completed";
const ERROR = "error";

export class APIService {
  private async setTranscriptionStatus(uuid: string, status: string, summary?: string) {
    const payload = { status, summary };
    await axios.put(`http://api:3000/api/transcription/${uuid}`, payload);
  }

  public async setToProcessing(uuid: string) {
    return this.setTranscriptionStatus(uuid, PROCESSING);
  }

  public async setToCompleted(uuid: string, summary: string) {
    return this.setTranscriptionStatus(uuid, COMPLETED, summary);
  }

  public async setToError(uuid: string) {
    return this.setTranscriptionStatus(uuid, ERROR);
  }
}
