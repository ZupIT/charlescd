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
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { UndeploymentStatusEnum } from '../enums'
import { ComponentUndeploymentEntity } from './component-undeployment.entity'
import { UndeploymentEntity } from './undeployment.entity'
import { v4 as uuidv4 } from 'uuid'
import { ModuleDeploymentEntity } from './module-deployment.entity'
import { ReadModuleUndeploymentDto } from '../dto'

@Entity('module_undeployments')
export class ModuleUndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @OneToOne(() => ModuleDeploymentEntity)
  @JoinColumn({ name: 'module_deployment_id' })
  public moduleDeployment: ModuleDeploymentEntity

  @ManyToOne(
    () => UndeploymentEntity,
    undeployment => undeployment.moduleUndeployments,
  )
  @JoinColumn({ name: 'undeployment_id' })
  public undeployment!: UndeploymentEntity

  @OneToMany(
    () => ComponentUndeploymentEntity,
    componentUndeployment => componentUndeployment.moduleUndeployment,
    { cascade: true }
  )
  public componentUndeployments: ComponentUndeploymentEntity[]

  @Column({ name: 'status' })
  public status: UndeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @Column({ name: 'finished_at' })
  public finishedAt!: Date

  constructor(
    moduleDeployment: ModuleDeploymentEntity,
    componentUndeployments: ComponentUndeploymentEntity[]
  ) {
    super()
    this.id = uuidv4()
    this.moduleDeployment = moduleDeployment
    this.componentUndeployments = componentUndeployments
    this.status = UndeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadModuleUndeploymentDto {
    return new ReadModuleUndeploymentDto(
      this.id,
      this.moduleDeployment.id,
      this.componentUndeployments.map(component => component.toReadDto()),
      this.status,
      this.createdAt
    )
  }
}
