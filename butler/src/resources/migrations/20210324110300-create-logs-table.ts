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

export class CreateLogsTable20210324110300 implements MigrationInterface {


  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.query(`
        CREATE TABLE "public"."v2logs" (
             "id" uuid DEFAULT gen_random_uuid () NOT NULL,
            "deployment_id" uuid NOT NULL,
            "logs" jsonb NOT NULL,
             PRIMARY KEY ( "id" ),
             CONSTRAINT "fk_v2deployments" FOREIGN KEY ( "deployment_id" ) REFERENCES "public"."v2deployments" ( "id" )     
        )`)
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.dropTable(`
    v2logs`)
  }

    
}