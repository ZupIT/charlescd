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

import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDefaultFieldToDeployment20200917141900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.query(
      'ALTER TABLE v2deployments ADD COLUMN default_circle boolean')
    await queryRunner.query(
      'UPDATE v2deployments SET default_circle = true WHERE circle_id IS NULL')
    await queryRunner.query(
      'UPDATE v2deployments SET default_circle = false WHERE circle_id IS NOT NULL')
    await queryRunner.query(
      'ALTER TABLE v2deployments ALTER COLUMN default_circle SET NOT NULL')
  }

  public async down(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.query('ALTER TABLE v2deployments DROP COLUMN default_circle')
  }
}
