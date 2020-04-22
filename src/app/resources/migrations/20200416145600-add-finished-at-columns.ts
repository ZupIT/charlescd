import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddFinishedAtColumns20200420144600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('deployments', new TableColumn({
            name: 'finished_at',
            type: 'timestamp',
            isNullable: true
        }))

        await queryRunner.addColumn('module_deployments', new TableColumn({
            name: 'finished_at',
            type: 'timestamp',
            isNullable: true
        }))

        await queryRunner.addColumn('component_deployments', new TableColumn({
            name: 'finished_at',
            type: 'timestamp',
            isNullable: true
        }))


    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropColumn('deployments', 'finished_at')

        await queryRunner.dropColumn('module_deployments', 'finished_at')

        await queryRunner.dropColumn('component_deployments', 'finished_at')
    }
}
