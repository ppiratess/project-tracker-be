import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754152359647 implements MigrationInterface {
    name = 'Migration1754152359647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdBy" uuid NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "status" "public"."project_task_status_enum" NOT NULL DEFAULT 'TODO', "projectId" uuid NOT NULL, CONSTRAINT "PK_f8275249858f42bc01e47cb979d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_task_members_users" ("projectTaskId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_208a0a7d69c9fcfd9e0dfacdafc" PRIMARY KEY ("projectTaskId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5107555d4b9baf78a2e849ac3c" ON "project_task_members_users" ("projectTaskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2f013d3c915dd23edfbb0c92a" ON "project_task_members_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "project_task" ADD CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_task_members_users" ADD CONSTRAINT "FK_5107555d4b9baf78a2e849ac3c2" FOREIGN KEY ("projectTaskId") REFERENCES "project_task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_task_members_users" ADD CONSTRAINT "FK_a2f013d3c915dd23edfbb0c92ab" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task_members_users" DROP CONSTRAINT "FK_a2f013d3c915dd23edfbb0c92ab"`);
        await queryRunner.query(`ALTER TABLE "project_task_members_users" DROP CONSTRAINT "FK_5107555d4b9baf78a2e849ac3c2"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2f013d3c915dd23edfbb0c92a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5107555d4b9baf78a2e849ac3c"`);
        await queryRunner.query(`DROP TABLE "project_task_members_users"`);
        await queryRunner.query(`DROP TABLE "project_task"`);
    }

}
