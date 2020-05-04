import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateModuleUndeploymentsTable20191028150900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.createTable(new Table({
            name: 'module_undeployments',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'undeployment_id',
                    type: 'varchar'
                },
                {
                    name: 'module_deployment_id',
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
        await queryRunner.dropTable('module_undeployments')
    }
}
