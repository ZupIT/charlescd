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
  PrimaryGeneratedColumn
} from 'typeorm'
import {
  QueuedPipelineStatusEnum,
} from '../enums'
import { ReadQueuedIstioDeploymentDto } from '../dto'

@Entity('queued_istio_deployments')
export class QueuedIstioDeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ name: 'deployment_id' })
  public deploymentId: string

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'component_deployment_id' })
  public componentDeploymentId: string

  @Column({ name: 'status' })
  public status: QueuedPipelineStatusEnum

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  constructor(
    deploymentId: string,
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum
  ) {
    super()
    this.deploymentId = deploymentId
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.status = status
  }

  public toReadDto(): ReadQueuedIstioDeploymentDto {
    return new ReadQueuedIstioDeploymentDto(
      this.id,
      this.deploymentId,
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
