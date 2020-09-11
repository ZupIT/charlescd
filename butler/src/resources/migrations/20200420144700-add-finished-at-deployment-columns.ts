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

export class AddFinishedAtDeploymentColumns20200420144700 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.addColumn('deployments', new TableColumn({
      name: 'finished_at',
      type: 'timestamp',
      isNullable: true
    }))

    await queryRunner.addColumn('module_deployments', new TableColumn({
      name: 'finished_at',
      type: 'timestamp',
      isNullable: true
    }))

    await queryRunner.addColumn('component_deployments', new TableColumn({
      name: 'finished_at',
      type: 'timestamp',
      isNullable: true
    }))

  }

  public async down(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.dropColumn('deployments', 'finished_at')

    await queryRunner.dropColumn('module_deployments', 'finished_at')

    await queryRunner.dropColumn('component_deployments', 'finished_at')
  }
}
