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
          name: 'module_id',
          type: 'varchar'
        },
        {
          name: 'pipeline_options',
          type: 'jsonb'
        },
        {
          name: 'created_at',
          type: 'date'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('components')
  }
}
