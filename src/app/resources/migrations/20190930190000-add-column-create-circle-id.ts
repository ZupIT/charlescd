import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddColumnCreateCircleId20190930190000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('deployments', new TableColumn({
            name: 'circle_id',
            type: 'varchar'
        }))
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropColumn('deployments', 'circle_id')
    }
}
