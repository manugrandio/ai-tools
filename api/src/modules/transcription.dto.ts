import { IsNotEmpty, IsString } from "class-validator";

export class CreateTranscriptionDto {
  @IsString()
  @IsNotEmpty()
  public content: string;
}

export class UpdateTranscriptionDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public status: string;

  @IsString()
  public summary?: string;
}
