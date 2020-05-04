import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameValueFlowIdColumn20200124152700 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.renameColumn('deployments', 'value_flow_id', 'application_name')
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.renameColumn('deployments', 'application_name', 'value_flow_id')
  }
}
