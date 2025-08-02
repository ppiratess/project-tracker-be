import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754127193472 implements MigrationInterface {
    name = 'Migration1754127193472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }

}
