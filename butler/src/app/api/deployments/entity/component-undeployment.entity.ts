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
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { UndeploymentStatusEnum } from '../enums'
import { ModuleUndeploymentEntity } from './module-undeployment.entity'
import { v4 as uuidv4 } from 'uuid'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { ReadComponentUndeploymentDto } from '../dto'

@Entity('component_undeployments')
export class ComponentUndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @OneToOne(() => ComponentDeploymentEntity)
  @JoinColumn({ name: 'component_deployment_id' })
  public componentDeployment: ComponentDeploymentEntity

  @ManyToOne(
    () => ModuleUndeploymentEntity,
    moduleUndeployment => moduleUndeployment.componentUndeployments
  )
  @JoinColumn({ name: 'module_undeployment_id' })
  public moduleUndeployment!: ModuleUndeploymentEntity

  @Column({ name: 'status' })
  public status: UndeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt!: Date

  @Column({ name: 'finished_at' } )
  public finishedAt!: Date

  constructor(
    componentDeployment: ComponentDeploymentEntity
  ) {
    super()
    this.id = uuidv4()
    this.componentDeployment = componentDeployment
    this.status = UndeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadComponentUndeploymentDto {
    return new ReadComponentUndeploymentDto(
      this.id,
      this.componentDeployment.id,
      this.status,
      this.createdAt
    )
  }
}
