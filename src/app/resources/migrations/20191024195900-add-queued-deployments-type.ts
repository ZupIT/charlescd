import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddQueuedDeploymentsType20191024195900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn('queued_deployments', new TableColumn({
      name: 'type',
      type: 'varchar',
      default: '\'QueuedDeploymentEntity\''
    }))
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn('queued_deployments', 'type')
  }
}
