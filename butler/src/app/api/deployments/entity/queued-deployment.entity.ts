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
  PrimaryGeneratedColumn,
  TableInheritance
} from 'typeorm'
import {
  QueuedPipelineStatusEnum,
  QueuedPipelineTypesEnum
} from '../enums'
import { ReadQueuedDeploymentDto } from '../dto'

@Entity('queued_deployments')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class QueuedDeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'component_deployment_id' })
  public componentDeploymentId: string

  @Column({ name: 'status' })
  public status: QueuedPipelineStatusEnum

  @Column({ name: 'type' })
  public type: QueuedPipelineTypesEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt!: Date

  constructor(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum
  ) {
    super()
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.status = status
    this.type = QueuedPipelineTypesEnum.QueuedDeploymentEntity
  }

  public toReadDto(): ReadQueuedDeploymentDto {
    return new ReadQueuedDeploymentDto(
      this.id,
      this.componentId,
      this.componentDeploymentId,
      this.status,
      this.createdAt
    )
  }

  public isRunning(): boolean {
    return this.status === QueuedPipelineStatusEnum.RUNNING
  }
}
