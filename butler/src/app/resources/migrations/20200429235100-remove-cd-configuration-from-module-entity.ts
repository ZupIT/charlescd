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

export class RemoveCdConfigurationFromModules20200429235100 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE modules DROP CONSTRAINT module_cd_configuration_fk;', [])
        await queryRunner.query('ALTER TABLE modules DROP COLUMN cd_configuration_id;', [])
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.addColumn('modules', new TableColumn({
            name: 'cd_configuration_id',
            type: 'varchar',
            isNullable: true
        }))
        await queryRunner.query(
            'ALTER TABLE modules ADD CONSTRAINT module_cd_configuration_fk FOREIGN KEY (cd_configuration_id) REFERENCES cd_configurations(id);',
            []
        )
    }
}
