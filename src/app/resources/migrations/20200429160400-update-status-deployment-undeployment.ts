import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateStatusDeploymentUndeployment20200429160400 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.query(`UPDATE  DEPLOYMENTS SET  STATUS = 'SUCCEEDED' where status='FINISHED'`)
    await queryRunner.query(`UPDATE  MODULE_DEPLOYMENTS SET  STATUS = 'SUCCEEDED' where status='FINISHED'`)
    await queryRunner.query(`UPDATE  COMPONENT_DEPLOYMENTS SET  STATUS = 'SUCCEEDED' where status='FINISHED'`)
    await queryRunner.query(`UPDATE  COMPONENT_UNDEPLOYMENTS SET  STATUS = 'SUCCEEDED' where status='FINISHED'`)
    await queryRunner.query(`UPDATE  MODULE_UNDEPLOYMENTS SET  STATUS = 'SUCCEEDED' where status='FINISHED'`)
    await queryRunner.query(`UPDATE  UNDEPLOYMENTS SET  STATUS = 'SUCCEEDED' where status='FINISHED'`)
  }

  public async down(queryRunner: QueryRunner) {}

}
