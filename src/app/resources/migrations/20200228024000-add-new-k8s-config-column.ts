import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddNewK8sConfigColumn20200228024000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('modules', new TableColumn({
            name: 'k8s_configuration_id',
            type: 'varchar',
            isNullable: true
        }))

        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_k8s_configuration_fk FOREIGN KEY (k8s_configuration_id) REFERENCES k8s_configurations(id) ON DELETE CASCADE;',
            []
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_k8s_configuration_fk;', [])
        await queryRunner.dropColumn('modules', 'k8s_configuration_id')
    }
}
