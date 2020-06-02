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

export class CreateComponentDeploymentsTable20190808190900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'component_deployments',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'module_deployment_id',
          type: 'varchar'
        },
        {
          name: 'component_id',
          type: 'varchar'
        },
        {
          name: 'build_image_url',
          type: 'varchar'
        },
        {
          name: 'build_image_tag',
          type: 'varchar'
        },
        {
          name: 'status',
          type: 'varchar'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('component_deployments')
  }
}
