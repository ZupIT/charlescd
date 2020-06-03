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

export class DropConstraintNotnullComponentDeployment20200212170000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN context_path DROP NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN health_check DROP NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN port DROP NOT NULL;', [])
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN context_path SET NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN health_check SET NOT NULL;', [])
        await queryRunner.query('ALTER TABLE component_deployments ALTER COLUMN port SET NOT NULL;', [])
    }
}
