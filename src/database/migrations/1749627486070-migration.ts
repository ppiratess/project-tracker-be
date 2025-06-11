import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749627486070 implements MigrationInterface {
    name = 'Migration1749627486070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "isActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "isActive" boolean NOT NULL DEFAULT false`);
    }

}
