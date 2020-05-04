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
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('k8s_configurations')
    }
}
