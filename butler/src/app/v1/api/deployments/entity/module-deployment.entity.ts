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
  PrimaryColumn
} from 'typeorm'
import { DeploymentEntity } from './deployment.entity'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { ReadModuleDeploymentDto } from '../dto'
import { DeploymentStatusEnum } from '../enums'
import { v4 as uuidv4 } from 'uuid'

@Entity('module_deployments')
export class ModuleDeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @ManyToOne(
    () => DeploymentEntity,
    deployment => deployment.modules,
  )
  @JoinColumn({ name: 'deployment_id' })
  public deployment!: DeploymentEntity

  @Column({ name: 'module_id' })
  public moduleId: string

  @Column({ name: 'helm_repository' })
  public readonly helmRepository: string

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @OneToMany(
    () => ComponentDeploymentEntity,
    componentDeployment => componentDeployment.moduleDeployment,
    { cascade: true, eager: true }
  )
  public components: ComponentDeploymentEntity[]

  @CreateDateColumn({ name: 'created_at'})
  public createdAt!: Date

  @Column({ name: 'finished_at'})
  public finishedAt!: Date

  constructor(
    moduleId: string,
    helmRepository: string,
    components: ComponentDeploymentEntity[]
  ) {
    super()
    this.id = uuidv4()
    this.moduleId = moduleId
    this.helmRepository = helmRepository
    this.components = components
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadModuleDeploymentDto {
    return new ReadModuleDeploymentDto(
      this.id,
      this.moduleId,
      this.helmRepository,
      this.components.map(component => component.toReadDto()),
      this.status,
      this.createdAt
    )
  }
}
