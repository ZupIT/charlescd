import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class RemoveCdConfigurationFromModules20200429235100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_cd_configuration_fk;', [])
        await queryRunner.query('ALTER TABLE modules DROP COLUMN cd_configuration_id;', [])
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.addColumn('modules', new TableColumn({
            name: 'cd_configuration_id',
            type: 'varchar',
            isNullable: true
        }))
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_cd_configuration_fk FOREIGN KEY (cd_configuration_id) REFERENCES cd_configurations(id);',
            []
        )
    }
}
