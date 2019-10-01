import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddCreatedAtColumns20190918174700 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn('deployments', new TableColumn({
      name: 'created_at',
      type: 'date',
      default: 'now()'
    }))

    await queryRunner.addColumn('module_deployments', new TableColumn({
      name: 'created_at',
      type: 'date',
      default: 'now()'
    }))

    await queryRunner.addColumn('component_deployments', new TableColumn({
      name: 'created_at',
      type: 'date',
      default: 'now()'
    }))

    await queryRunner.dropColumn('modules', 'module_id')

    await queryRunner.addColumn('modules', new TableColumn({
      name: 'created_at',
      type: 'date',
      default: 'now()'
    }))

    await queryRunner.dropColumn('components', 'component_id')

    await queryRunner.addColumn('components', new TableColumn({
      name: 'created_at',
      type: 'date',
      default: 'now()'
    }))
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn('deployments', 'created_at')

    await queryRunner.dropColumn('module_deployments', 'created_at')

    await queryRunner.dropColumn('component_deployments', 'created_at')

    await queryRunner.addColumn('modules', new TableColumn({
      name: 'module_id',
      type: 'varchar',
      isUnique: true
    }))

    await queryRunner.dropColumn('modules', 'created_at')

    await queryRunner.addColumn('components', new TableColumn({
      name: 'component_id',
      type: 'varchar'
    }))

    await queryRunner.dropColumn('components', 'created_at')
  }
}
