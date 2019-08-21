import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateQueuedDeploymentsTable20190808220901 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'queued_deployments',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true
        },
        {
          name: 'component_id',
          type: 'varchar'
        },
        {
          name: 'component_deployment_id',
          type: 'varchar'
        },
        {
          name: 'status',
          type: 'varchar'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('queued_deployments')
  }
}
