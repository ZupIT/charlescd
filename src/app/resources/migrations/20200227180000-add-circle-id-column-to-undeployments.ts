import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddCircleIdColumnToUndeployments20200227180000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('undeployments', new TableColumn({
            name: 'circle_id',
            type: 'varchar',
            isNullable: false
        }))
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropColumn('undeployments', 'circle_id')
    }
}
