import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddCdConfigurationToDeployments20200429235000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.addColumn('deployments', new TableColumn({
            name: 'cd_configuration_id',
            type: 'varchar',
            isNullable: true
        }))

        await queryRunner.query(
            'ALTER TABLE deployments ADD CONSTRAINT deployment_cd_configuration_fk FOREIGN KEY (cd_configuration_id) REFERENCES cd_configurations(id);',
            []
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE deployments DROP CONSTRAINT deployment_cd_configuration_fk;', [])
        await queryRunner.dropColumn('deployments', 'cd_configuration_id')
    }
}
