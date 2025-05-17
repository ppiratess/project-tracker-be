import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747476775619 implements MigrationInterface {
    name = 'Migration1747476775619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "userName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "userName" TO "username"`);
    }

}
