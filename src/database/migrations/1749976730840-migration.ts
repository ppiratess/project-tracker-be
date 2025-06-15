import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749976730840 implements MigrationInterface {
    name = 'Migration1749976730840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."project_members_role_enum" AS ENUM('OWNER', 'MANAGER', 'QA', 'DEVELOPER', 'DESIGNER', 'GUEST')`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD "role" "public"."project_members_role_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD "projectId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_326b2a901eb18ac24eabc9b058" ON "project_members" ("projectId", "userId") `);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_d19892d8f03928e5bfc7313780c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_08d1346ff91abba68e5a637cfdb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_08d1346ff91abba68e5a637cfdb"`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_d19892d8f03928e5bfc7313780c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_326b2a901eb18ac24eabc9b058"`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD "projectId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."project_members_role_enum"`);
    }

}
