import {
    MigrationInterface,
    QueryRunner,
    Table
} from 'typeorm'

export class CreateK8sConfigurationsTable20200226214600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {

        await queryRunner.createTable(new Table({
            name: 'k8s_configurations',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'configuration_data',
                    type: 'text'
                },
                {
                    name: 'user_id',
                    type: 'varchar'
                },
                {
                    name: 'application_id',
                    type: 'varchar'
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'module_id',
                    type: 'varchar'
                },
            ]
        }), true)

        await queryRunner.query(
            'ALTER TABLE k8s_configurations ADD CONSTRAINT k8s_config_module_fk FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE;',
            []
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE k8s_configurations DROP CONSTRAINT k8s_config_module_fk;', [])
        await queryRunner.dropTable('k8s_configurations')
    }
}
