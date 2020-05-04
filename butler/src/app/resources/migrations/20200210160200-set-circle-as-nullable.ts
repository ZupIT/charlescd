import {
    MigrationInterface,
    QueryRunner,
    TableColumn
} from 'typeorm'

export class SetCircleAsNullable20200210160200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.changeColumn(
            'deployments',
            'circle',
            new TableColumn({
                name: 'circle',
                type: 'jsonb',
                isNullable: true
            })
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.changeColumn(
            'deployments',
            'circle',
            new TableColumn({
                name: 'circle',
                type: 'jsonb'
            })
        )
    }
}
