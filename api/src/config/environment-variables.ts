import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  public NODE_ENV: string;

  @IsNumber()
  @IsNotEmpty()
  public APP_PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  public APP_HOST: string = "localhost";

  @IsString()
  @IsNotEmpty()
  public DB_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  public DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  public DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  public DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  public DB_NAME: string;

  @IsNumber()
  @IsNotEmpty()
  public RABBITMQ_PORT: number;

  @IsString()
  @IsNotEmpty()
  public RABBITMQ_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  public RABBITMQ_PASSWORD: string;
}

