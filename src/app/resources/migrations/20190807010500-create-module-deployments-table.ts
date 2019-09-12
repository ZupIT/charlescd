import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateModuleDeploymentsTable20190807010500 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'module_deployments',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'deployment_id',
          type: 'varchar'
        },
        {
          name: 'module_id',
          type: 'varchar'
        },
        {
          name: 'status',
          type: 'varchar'
        },
        {
          name: 'created_at',
          type: 'date'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('module_deployments')
  }
}
