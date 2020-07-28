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

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeploymentEntityV2 as DeploymentEntity } from './deployment.entity';
@Entity('v2executions')
export class Execution {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  type!: 'DEPLOYMENT' | 'UNDEPLOYMENT' // move this to a type

  @JoinColumn({ name: 'deployment_id' })
  @ManyToOne(() => DeploymentEntity, deployment => deployment.executions)
  deployment!: DeploymentEntity

}
