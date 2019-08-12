import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateComponentDeploymentsTable20190808190900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'component_deployments',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'module_deployment_id',
          type: 'varchar'
        },
        {
          name: 'component_id',
          type: 'varchar'
        },
        {
          name: 'build_image_url',
          type: 'varchar'
        },
        {
          name: 'build_image_tag',
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
    await queryRunner.dropTable('component_deployments')
  }
}
