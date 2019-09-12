import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateModulesTable20190808220900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'modules',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'created_at',
          type: 'date'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('modules')
  }
}
