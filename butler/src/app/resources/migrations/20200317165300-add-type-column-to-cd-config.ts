import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddTypeColumnToCdConfig20200317165300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('cd_configurations', new TableColumn({
            name: 'type',
            type: 'varchar',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropColumn(
            'cd_configurations',
            'type'
        )
    }
}
