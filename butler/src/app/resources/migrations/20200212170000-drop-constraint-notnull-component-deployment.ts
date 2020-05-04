import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class DropConstraintNotnullComponentDeployment20200212170000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN context_path DROP NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN health_check DROP NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN port DROP NOT NULL;', [])
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN context_path SET NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN health_check SET NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN port SET NOT NULL;', [])
    }
}
