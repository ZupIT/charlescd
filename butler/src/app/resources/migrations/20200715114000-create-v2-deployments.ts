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

export class CreateV2Deployments20200715114000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.createTable(new Table({
          name: 'v2deployments',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true
            },
            {
              name: 'active',
              type: 'boolean',
              isNullable: false,
              default: false
            },
            {
              name: 'application_name',
              type: 'varchar',
              isNullable: false
            },
            {
              name: 'author_id',
              type: 'varchar',
              isNullable: false
            },
            {
              name: 'callback_url',
              type: 'varchar',
              isNullable: false
            },
            {
              name: 'deployment_id',
              type: 'varchar',
              isNullable: false
            },
            {
              name: 'running',
              type: 'boolean',
              isNullable: false
            },
          ]
        }))
        await queryRunner.query(`
        CREATE INDEX "index_deployments_id" ON "public"."v2components" USING btree( "deployment_id" );
        CREATE INDEX "index_name" ON "public"."v2components" USING btree( "name" );
        CREATE UNIQUE INDEX "only_one_module_running" ON "public"."v2components" (running, name) WHERE (running)
        `)
    }

    public async down(queryRunner: QueryRunner) {
      await queryRunner.dropTable('v2components')
    }
}
