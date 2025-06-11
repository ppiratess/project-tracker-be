import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749630405530 implements MigrationInterface {
    name = 'Migration1749630405530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "createdBy" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "deletedBy" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "deletedBy"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdBy"`);
    }

}
