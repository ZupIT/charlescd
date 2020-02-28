import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddNewK8sConfigColumn20200228024000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('module_deployments', new TableColumn({
            name: 'k8s_config_id',
            type: 'varchar',
            isNullable: true
        }))

        await queryRunner.query(
            'ALTER TABLE module_deployments ADD CONSTRAINT module_deployments_k8s_config_fk FOREIGN KEY (k8s_config_id) REFERENCES k8s_configurations(id) ON DELETE CASCADE;',
            []
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE module_deployments DROP CONSTRAINT module_deployments_k8s_config_fk;', [])
        await queryRunner.dropColumn('module_deployments', 'k8s_config_id')
    }
}
