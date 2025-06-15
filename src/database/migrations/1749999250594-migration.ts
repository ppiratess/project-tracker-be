import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749999250594 implements MigrationInterface {
    name = 'Migration1749999250594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_members" DROP COLUMN "isDeleted"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_members" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

}
