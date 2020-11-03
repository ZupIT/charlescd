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
import { AppConstants } from '../../app/v1/core/constants'

export class UpdateV2DeploymentsSetCircleIdNotNull20201003153500 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.query(`
    UPDATE v2deployments SET circle_id = '${AppConstants.DEFAULT_CIRCLE_ID}' WHERE circle_id = NULL
    `)
    await queryRunner.query('ALTER TABLE v2deployments ALTER COLUMN circle_id SET NOT NULL ')
  }

  public async down(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.query(`
    UPDATE v2deployments SET circle_id = NULL WHERE circle_id = '${AppConstants.DEFAULT_CIRCLE_ID}' 
    `)
    await queryRunner.query('ALTER TABLE v2deployments ALTER COLUMN circle_id DROP NOT NULL ')
  }
}
