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
  PrimaryColumn
} from 'typeorm'
import { ReadComponentDeploymentDto } from '../dto'
import { ModuleDeploymentEntity } from './module-deployment.entity'
import { DeploymentStatusEnum } from '../enums'
import { v4 as uuidv4 } from 'uuid'

@Entity('component_deployments')
export class ComponentDeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @ManyToOne(
    () => ModuleDeploymentEntity,
    moduleDeployment => moduleDeployment.components
  )
  @JoinColumn({ name: 'module_deployment_id' })
  public moduleDeployment!: ModuleDeploymentEntity

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'component_name' })
  public componentName: string

  @Column({ name: 'build_image_url' })
  public buildImageUrl: string

  @Column({ name: 'build_image_tag' })
  public buildImageTag: string

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @Column({ name: 'finished_at' })
  public finishedAt!: Date

  constructor(
    componentId: string,
    componentName: string,
    buildImageUrl: string,
    buildImageTag: string
  ) {
    super()
    this.id = uuidv4()
    this.componentId = componentId
    this.componentName = componentName
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadComponentDeploymentDto {
    return new ReadComponentDeploymentDto(
      this.id,
      this.componentId,
      this.componentName,
      this.buildImageUrl,
      this.buildImageTag,
      this.status,
      this.createdAt
    )
  }
}
