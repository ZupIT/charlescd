import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateDeploymentsTable20190807003400 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'deployments',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'user_id',
          type: 'varchar'
        },
        {
          name: 'description',
          type: 'varchar'
        },
        {
          name: 'callback_url',
          type: 'varchar'
        },
        {
          name: 'circle_header',
          type: 'varchar'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('deployments')
  }
}
