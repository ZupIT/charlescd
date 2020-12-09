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

export class DeleteUnusedv1Tables20201207153500 implements MigrationInterface {

  public async up(queryRunner: QueryRunner) : Promise<void> {
    await queryRunner.query(`
      drop table if exists component_deployments;
      drop table if exists component_undeployments;
      drop table if exists component_deployments;
      drop table if exists components;
      drop table if exists deployments;
      drop table if exists  module_deployments;
      drop table if exists module_undeployments;
      drop table if exists modules;
      drop table if exists queued_deployments;
      drop table if exists queued_istio_deployments;
      drop table if exists undeployments;
      drop table if exists module_deployments;
    `)
  }

  public async down() : Promise<void> {
    throw new Error('Cannot rollback this migration')
  }
}
