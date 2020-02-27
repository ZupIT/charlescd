import {
    MigrationInterface,
    QueryRunner
} from 'typeorm'

export class CreatePgcryptoExtension20200226213100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;', [])
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('DROP EXTENSION IF EXISTS pgcrypto;', [])
    }
}
