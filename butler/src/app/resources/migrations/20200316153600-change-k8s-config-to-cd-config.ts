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

export class ChangeK8sConfigToCdConfig20200316153600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE k8s_configurations RENAME TO cd_configurations;', [])
        await queryRunner.query('ALTER TABLE modules RENAME COLUMN k8s_configuration_id TO cd_configuration_id;')
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_k8s_configuration_fk;', [])
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_cd_configuration_fk FOREIGN KEY (cd_configuration_id) REFERENCES cd_configurations(id);',
            []
        )
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE cd_configurations RENAME TO k8s_configurations;', [])
        await queryRunner.query('ALTER TABLE modules RENAME COLUMN cd_configuration_id TO k8s_configuration_id;')
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_k8s_configuration_fk FOREIGN KEY (k8s_configuration_id) REFERENCES k8s_configurations(id) ON DELETE CASCADE;',
            []
        )
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_cd_configuration_fk;', [])
    }
}
