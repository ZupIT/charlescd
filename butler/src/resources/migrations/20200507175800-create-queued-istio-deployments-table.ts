/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateQueuedIstioDeploymentsTable20200507175800 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'queued_istio_deployments',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
          isGenerated: true
        },
        {
          name: 'deployment_id',
          type: 'varchar'
        },
        {
          name: 'component_id',
          type: 'varchar'
        },
        {
          name: 'component_deployment_id',
          type: 'varchar'
        },
        {
          name: 'circle_id',
          type: 'varchar'
        },
        {
          name: 'status',
          type: 'varchar'
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.dropTable('queued_istio_deployments')
  }
}
