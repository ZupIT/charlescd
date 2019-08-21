import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateDeploymentsQueueTable20190808220901 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'deployments_queue',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'position',
          type: 'integer'
        },
        {
          name: 'component_deployment_id',
          type: 'varchar'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('deployments_queue')
  }
}
