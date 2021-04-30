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
import { AppConstants } from '../../app/v2/core/constants'

export class AddNamespaceColumnToDeployments20210302120000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE v2deployments ADD COLUMN namespace Character Varying;

      with config_data as (
        select id, PGP_SYM_DECRYPT(configuration_data::bytea, '${AppConstants.ENCRYPTION_KEY}', 'cipher-algo=aes256')::jsonb->'namespace' as namespace from cd_configurations
      )

      update v2deployments
        set namespace = config_data.namespace
      from config_data
      where v2deployments.cd_configuration_id = config_data.id;

      ALTER TABLE v2deployments DROP CONSTRAINT fk_v2cd_config_deployments;
      ALTER TABLE v2deployments ALTER COLUMN cd_configuration_id DROP NOT NULL;
      ALTER TABLE v2deployments ALTER COLUMN namespace SET NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE v2deployments DROP COLUMN namespace;
      ALTER TABLE v2deployments ADD CONSTRAINT "fk_v2cd_config_deployments" FOREIGN KEY ( "cd_configuration_id" ) REFERENCES "public"."cd_configurations" ( "id" );
      ALTER TABLE v2deployments ALTER COLUMN cd_configuration_id SET NOT NULL;
    `)
  }
}
