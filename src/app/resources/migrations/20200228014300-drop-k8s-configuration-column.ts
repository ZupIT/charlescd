import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class DropK8sConfigurationColumn20200228014300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.dropColumn(
            'module_deployments',
            'k8s_configuration_id'
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.addColumn('module_deployments', new TableColumn({
            name: 'k8s_configuration_id',
            type: 'varchar'
        }))
    }
}
