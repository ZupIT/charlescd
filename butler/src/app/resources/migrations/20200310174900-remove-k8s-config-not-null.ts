import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveK8sConfigNotNull20200310174900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE module_deployments ALTER COLUMN k8s_configuration_id DROP NOT NULL;', [])
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE module_deployments ALTER COLUMN k8s_configuration_id SET NOT NULL;', [])
    }
}
