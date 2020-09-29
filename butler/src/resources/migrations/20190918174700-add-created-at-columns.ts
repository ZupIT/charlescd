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

export class AddCreatedAtColumns20190918174700 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.addColumn('deployments', new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'now()'
    }))

    await queryRunner.addColumn('module_deployments', new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'now()'
    }))

    await queryRunner.addColumn('component_deployments', new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'now()'
    }))

    await queryRunner.dropColumn('modules', 'module_id')

    await queryRunner.addColumn('modules', new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'now()'
    }))

    await queryRunner.dropColumn('components', 'component_id')

    await queryRunner.addColumn('components', new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'now()'
    }))
  }

  public async down(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.dropColumn('deployments', 'created_at')

    await queryRunner.dropColumn('module_deployments', 'created_at')

    await queryRunner.dropColumn('component_deployments', 'created_at')

    await queryRunner.addColumn('modules', new TableColumn({
      name: 'module_id',
      type: 'varchar',
      isUnique: true
    }))

    await queryRunner.dropColumn('modules', 'created_at')

    await queryRunner.addColumn('components', new TableColumn({
      name: 'component_id',
      type: 'varchar'
    }))

    await queryRunner.dropColumn('components', 'created_at')
  }
}
