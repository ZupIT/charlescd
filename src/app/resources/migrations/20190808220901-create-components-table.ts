import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateComponentsTable20190808220901 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'components',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'component_id',
          type: 'varchar'
        },
        {
          name: 'module_id',
          type: 'varchar'
        },
        {
          name: 'pipeline_options',
          type: 'jsonb'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('components')
  }
}
