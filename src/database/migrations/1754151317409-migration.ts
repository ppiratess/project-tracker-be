import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754151317409 implements MigrationInterface {
    name = 'Migration1754151317409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."project_tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'ON_HOLD', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "project_tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdBy" uuid NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "status" "public"."project_tasks_status_enum" NOT NULL DEFAULT 'TODO', "projectId" uuid NOT NULL, CONSTRAINT "PK_b1b6204912a6f44133df3a4518b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_tasks_members_users" ("projectTasksId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_c03b98eb08d7e62b78841da60bb" PRIMARY KEY ("projectTasksId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13a55635c7e306102bc8648651" ON "project_tasks_members_users" ("projectTasksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ae54fa83aa61408d1079bbd4a7" ON "project_tasks_members_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "project_tasks" ADD CONSTRAINT "FK_8691c10b6396e041f4b6d48f8a0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_tasks_members_users" ADD CONSTRAINT "FK_13a55635c7e306102bc86486513" FOREIGN KEY ("projectTasksId") REFERENCES "project_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_tasks_members_users" ADD CONSTRAINT "FK_ae54fa83aa61408d1079bbd4a7e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_tasks_members_users" DROP CONSTRAINT "FK_ae54fa83aa61408d1079bbd4a7e"`);
        await queryRunner.query(`ALTER TABLE "project_tasks_members_users" DROP CONSTRAINT "FK_13a55635c7e306102bc86486513"`);
        await queryRunner.query(`ALTER TABLE "project_tasks" DROP CONSTRAINT "FK_8691c10b6396e041f4b6d48f8a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae54fa83aa61408d1079bbd4a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13a55635c7e306102bc8648651"`);
        await queryRunner.query(`DROP TABLE "project_tasks_members_users"`);
        await queryRunner.query(`DROP TABLE "project_tasks"`);
        await queryRunner.query(`DROP TYPE "public"."project_tasks_status_enum"`);
    }

}
