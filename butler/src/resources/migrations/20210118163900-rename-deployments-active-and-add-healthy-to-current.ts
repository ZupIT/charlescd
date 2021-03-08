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

export class RenameDeploymentsActiveAndAddHealthyToCurrent20210118163900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('v2deployments', new TableColumn({
      name: 'active',
      type: 'boolean'
    }),
    new TableColumn({
      name: 'current',
      type: 'boolean'
    }))

    await queryRunner.addColumn('v2deployments', new TableColumn({
      name: 'healthy',
      type: 'boolean',
      default: false,
      isNullable: false
    }))

    await queryRunner.addColumn('v2deployments', new TableColumn({
      name: 'routed',
      type: 'boolean',
      default: false,
      isNullable: false
    }))

    await queryRunner.addColumn('v2deployments', new TableColumn({
      name: 'timeout_in_seconds',
      type: 'int',
      default: 60,
      isNullable: false
    }))
  }

  public async down(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.renameColumn('v2deployments', new TableColumn({
      name: 'current',
      type: 'boolean'
    }),
    new TableColumn({
      name: 'active',
      type: 'boolean'
    }))

    await queryRunner.dropColumn('v2deployments', 'healthy')
    await queryRunner.dropColumn('v2deployments', 'routed')
    await queryRunner.dropColumn('v2deployments', 'reconciliation_count')
  }
}
