import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeK8sConfigToCdConfig20200316153600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE k8s_configurations RENAME TO cd_configurations;', [])
        await queryRunner.query('ALTER TABLE modules RENAME COLUMN k8s_configuration_id TO cd_configuration_id;')
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_k8s_configuration_fk;', [])
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_cd_configuration_fk FOREIGN KEY (cd_configuration_id) REFERENCES cd_configurations(id);',
            []
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE cd_configurations RENAME TO k8s_configurations;', [])
        await queryRunner.query('ALTER TABLE modules RENAME COLUMN cd_configuration_id TO k8s_configuration_id;')
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_k8s_configuration_fk FOREIGN KEY (k8s_configuration_id) REFERENCES k8s_configurations(id) ON DELETE CASCADE;',
            []
        )
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_cd_configuration_fk;', [])
    }
}
