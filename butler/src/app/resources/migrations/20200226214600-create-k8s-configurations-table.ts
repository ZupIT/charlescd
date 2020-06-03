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

import {
    MigrationInterface,
    QueryRunner,
    Table
} from 'typeorm'

export class CreateK8sConfigurationsTable20200226214600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {

        await queryRunner.createTable(new Table({
            name: 'k8s_configurations',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'configuration_data',
                    type: 'text'
                },
                {
                    name: 'user_id',
                    type: 'varchar'
                },
                {
                    name: 'application_id',
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

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('k8s_configurations')
    }
}
