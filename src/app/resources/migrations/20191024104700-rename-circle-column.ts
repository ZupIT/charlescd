import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class RenameCircleColumn20191024104700 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.renameColumn(
      'deployments',
     'circles',
     'circle'
    )
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.renameColumn(
      'deployments',
      'circle',
      'circles'
    )
  }
}
