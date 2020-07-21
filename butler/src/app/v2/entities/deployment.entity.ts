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

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  ManyToOne
} from 'typeorm'
import { DeploymentStatusEnum } from '../../api/deployments/enums'
import { CircleEntity } from './circle.entity'
import { ComponentEntity } from './component.entity'

@Entity('v2deployments')
export class DeploymentEntity {

  @PrimaryColumn({ name: 'id' })
  public id!: string

  @Column({ name: 'user_id' })
  public authorId!: string

  @Column({ name: 'description' })
  public description!: string

  @Column({ name: 'callback_url' })
  public callbackUrl!: string

  @Column({ name: 'status', default: DeploymentStatusEnum.CREATED })
  public status!: DeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @Column({ name: 'finished_at' })
  public finishedAt!: Date

  @Column({ name: 'cd_configuration_id', type: 'varchar'})
  public cdConfigurationId!: string

  @OneToMany(() => CircleEntity, circle => circle.deployments)
  circle!: CircleEntity | null

  @OneToMany(() => ComponentEntity, component => component.deployment)
  public components!: ComponentEntity[]

  public hasSucceeded(): boolean {
    return this.status === DeploymentStatusEnum.SUCCEEDED
  }

  public hasFailed(): boolean {
    return this.status === DeploymentStatusEnum.FAILED
  }
}
