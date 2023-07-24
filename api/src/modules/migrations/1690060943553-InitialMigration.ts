import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1690060943553 implements MigrationInterface {
    name = "InitialMigration1690060943553"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transcription_status_enum" AS ENUM('queued', 'processing', 'completed', 'error')`);
        await queryRunner.query(`CREATE TABLE "transcription" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "hash" character varying NOT NULL, "content" character varying NOT NULL, "status" "public"."transcription_status_enum" NOT NULL DEFAULT 'queued', "summary" character varying, CONSTRAINT "PK_63f76ae232f874485e8c48ca769" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transcription"`);
        await queryRunner.query(`DROP TYPE "public"."transcription_status_enum"`);
    }

}
