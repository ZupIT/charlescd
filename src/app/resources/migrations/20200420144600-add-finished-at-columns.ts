import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddFinishedAtColumns20200420144600 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn('undeployments', new TableColumn({
      name: 'finished_at',
      type: 'timestamp',
      isNullable: true
    }))

    await queryRunner.addColumn('module_undeployments', new TableColumn({
      name: 'finished_at',
      type: 'timestamp',
      isNullable: true
    }))

    await queryRunner.addColumn('component_undeployments', new TableColumn({
      name: 'finished_at',
      type: 'timestamp',
      isNullable: true
    }))


  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn('undeployments', 'finished_at')

    await queryRunner.dropColumn('module_undeployments', 'finished_at')

    await queryRunner.dropColumn('component_undeployments', 'finished_at')
  }
}
