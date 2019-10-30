import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateComponentUndeploymentsTable20191028151300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.createTable(new Table({
            name: 'component_undeployments',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'module_undeployment_id',
                    type: 'varchar'
                },
                {
                    name: 'component_deployment_id',
                    type: 'varchar'
                },
                {
                    name: 'status',
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
        await queryRunner.dropTable('component_undeployments')
    }
}
