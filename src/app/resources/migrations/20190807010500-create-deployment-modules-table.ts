import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateDeploymentModulesTable20190807010500 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'deployment_modules',
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
          name: 'build_image_tag',
          type: 'varchar'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('deployment_modules')
  }
}
