import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749629142171 implements MigrationInterface {
    name = 'Migration1749629142171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."project_status_enum" RENAME TO "project_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum" AS ENUM('PLANNING', 'ACTIVE', 'INACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "status" TYPE "public"."project_status_enum" USING "status"::"text"::"public"."project_status_enum"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum_old" AS ENUM('ACTIVE', 'INACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "status" TYPE "public"."project_status_enum_old" USING "status"::"text"::"public"."project_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."project_status_enum_old" RENAME TO "project_status_enum"`);
    }

}
