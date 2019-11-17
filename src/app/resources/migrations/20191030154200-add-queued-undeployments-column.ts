import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddQueuedUndeploymentsColumn20191030154200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('queued_deployments', new TableColumn({
            name: 'component_undeployment_id',
            type: 'varchar',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropColumn(
            'queued_deployments',
            'component_undeployment_id'
        )
    }
}
