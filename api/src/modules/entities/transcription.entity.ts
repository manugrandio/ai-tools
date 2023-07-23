import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
  QUEUED = "queued",
  PROCESSING = "processing",
  COMPLETED = "completed",
  ERROR = "error",
}

@Entity()
export class Transcription {
  @PrimaryGeneratedColumn("uuid")
  public readonly uuid: string;

  @Column()
  public hash: string;

  @Column()
  public content: string;

  @Column()
  @Column({
    type: "enum",
    enum: Status,
    default: Status.QUEUED,
  })
  public status: string;

  @Column({ nullable: true })
  public summary: string;
}
