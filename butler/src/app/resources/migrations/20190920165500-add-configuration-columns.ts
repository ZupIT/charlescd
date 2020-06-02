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

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddConfigurationColumns20190920165500 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn('deployments', new TableColumn({
      name: 'value_flow_id',
      type: 'varchar'
    }))

    await queryRunner.addColumn('module_deployments', new TableColumn({
      name: 'k8s_configuration_id',
      type: 'varchar'
    }))

    await queryRunner.addColumn('component_deployments', new TableColumn({
      name: 'component_name',
      type: 'varchar'
    }))

    await queryRunner.addColumn('component_deployments', new TableColumn({
      name: 'context_path',
      type: 'varchar'
    }))

    await queryRunner.addColumn('component_deployments', new TableColumn({
      name: 'health_check',
      type: 'varchar'
    }))

    await queryRunner.addColumn('component_deployments', new TableColumn({
      name: 'port',
      type: 'integer'
    }))
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn('deployments', 'value_flow_id')

    await queryRunner.dropColumn('module_deployments', 'k8s_configuration_id')

    await queryRunner.dropColumn('component_deployments', 'component_name')

    await queryRunner.dropColumn('component_deployments', 'context_path')

    await queryRunner.dropColumn('component_deployments', 'health_check')

    await queryRunner.dropColumn('component_deployments', 'port')
  }
}
