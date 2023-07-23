import { IsNotEmpty, IsString } from "class-validator";

export class CreateTranscriptionDto {
  @IsString()
  @IsNotEmpty()
  public content: string;
}
