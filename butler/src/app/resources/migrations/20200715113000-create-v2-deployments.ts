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

import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateV2Deployments20200715113000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
      await queryRunner.query(`
        CREATE TABLE "public"."v2deployments" (
        "id" Character Varying NOT NULL,
        "application_name" Character Varying NOT NULL,
        "author_id" Character Varying NOT NULL,
        "description" Character Varying NOT NULL,
        "callback_url" Character Varying NOT NULL,
        "circle_id" Character Varying NOT NULL,
        "user_id" Character Varying NOT NULL,
        "status" Character Varying NOT NULL,
        "active" Boolean NOT NULL,
        "cd_configuration_id" Character Varying NOT NULL,
        "created_at" timestamp without time zone DEFAULT now() NOT NULL,
        "finished_at" timestamp without time zone DEFAULT now() NOT NULL,
        PRIMARY KEY ( "id" ),
        CONSTRAINT "unique_deployments_id" UNIQUE( "id" ),
        CONSTRAINT "fk_v2circles_deployments" FOREIGN KEY ( "circle_id" ) REFERENCES "public"."v2circles" ( "id" ),
        CONSTRAINT "fk_v2cd_config_deployments" FOREIGN KEY ( "cd_configuration_id" ) REFERENCES "public"."cd_configurations" ( "id" )
        );
        CREATE INDEX "index_v2_deployments_id" ON "public"."v2deployments" USING btree( "id" );
        CREATE UNIQUE INDEX only_one_active_for_circle ON v2deployments (active, circle_id, cd_configuration_id) WHERE (active)
        `)
    }

    public async down(queryRunner: QueryRunner) {
      await queryRunner.dropTable('v2deployments')
    }
}
