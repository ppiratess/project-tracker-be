import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749629583954 implements MigrationInterface {
    name = 'Migration1749629583954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "endDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "endDate" SET NOT NULL`);
    }

}
