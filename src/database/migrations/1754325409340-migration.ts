import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754325409340 implements MigrationInterface {
    name = 'Migration1754325409340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_task_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "taskId" uuid, "userId" uuid, CONSTRAINT "PK_d16a73f8c46c09aee56ed1ec06e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "projectId" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdBy" uuid NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "status" "public"."project_tasks_status_enum" NOT NULL DEFAULT 'TODO', CONSTRAINT "PK_b1b6204912a6f44133df3a4518b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_task_members" ADD CONSTRAINT "FK_04767103e905cee39a46fb0730f" FOREIGN KEY ("taskId") REFERENCES "project_tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_task_members" ADD CONSTRAINT "FK_d561fb2abfce688c578693a402b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_tasks" ADD CONSTRAINT "FK_8691c10b6396e041f4b6d48f8a0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_tasks" DROP CONSTRAINT "FK_8691c10b6396e041f4b6d48f8a0"`);
        await queryRunner.query(`ALTER TABLE "project_task_members" DROP CONSTRAINT "FK_d561fb2abfce688c578693a402b"`);
        await queryRunner.query(`ALTER TABLE "project_task_members" DROP CONSTRAINT "FK_04767103e905cee39a46fb0730f"`);
        await queryRunner.query(`DROP TABLE "project_tasks"`);
        await queryRunner.query(`DROP TABLE "project_task_members"`);
    }

}
