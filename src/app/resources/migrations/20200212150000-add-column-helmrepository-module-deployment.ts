import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddColumnHelmrepositoryModuleDeployment20200212150000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('module_deployments', new TableColumn({
            name: 'helm_repository',
            type: 'varchar',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropColumn(
            'module_deployments',
            'helm_repository'
        )
    }
}
