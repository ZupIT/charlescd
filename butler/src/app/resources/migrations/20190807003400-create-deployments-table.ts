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

export class CreateDeploymentsTable20190807003400 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(new Table({
      name: 'deployments',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'user_id',
          type: 'varchar'
        },
        {
          name: 'description',
          type: 'varchar'
        },
        {
          name: 'callback_url',
          type: 'varchar'
        },
        {
          name: 'default_circle',
          type: 'boolean'
        },
        {
          name: 'circles',
          type: 'jsonb'
        },
        {
          name: 'status',
          type: 'varchar'
        }
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('deployments')
  }
}
