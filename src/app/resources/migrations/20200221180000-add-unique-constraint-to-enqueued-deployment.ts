import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddUniqueConstraintToEnqueuedDeployment20200221180000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        queryRunner.query(`
            CREATE UNIQUE INDEX queued_deployments_status_running_uniq ON queued_deployments (component_id, status) where status = 'RUNNING'
        `
        )
    }

    public async down(queryRunner: QueryRunner) {
        queryRunner.query('DROP INDEX queued_deployments_status_running_uniq')
    }
}
