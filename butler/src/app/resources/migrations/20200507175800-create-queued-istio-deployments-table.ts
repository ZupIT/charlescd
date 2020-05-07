import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateQueuedIstioDeploymentsTable20200507175800 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'queued_istio_deployments',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
          isGenerated: true
        },
        {
          name: 'deployment_id',
          type: 'varchar'
        },
        {
          name: 'circle_id',
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
    await queryRunner.dropTable('queued_istio_deployments')
  }
}
