import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeK8sConfigToCdConfig20200316153600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE k8s_configurations RENAME TO cd_configurations;', [])
        await queryRunner.renameColumn('modules', 'k8s_configuration_id', 'cd_configuration_id')
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_k8s_configuration_fk;', [])
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_cd_configuration_fk FOREIGN KEY (cd_configuration_id) REFERENCES cd_configurations(id);',
            []
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE cd_configurations RENAME TO k8s_configurations;', [])
        await queryRunner.renameColumn('modules', 'cd_configuration_id', 'k8s_configuration_id')
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_k8s_configuration_fk FOREIGN KEY (k8s_configuration_id) REFERENCES k8s_configurations(id) ON DELETE CASCADE;',
            []
        )
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_cd_configuration_fk;', [])
    }
}
