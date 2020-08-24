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

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { DeploymentEntityV2 as DeploymentEntity } from './deployment.entity'
import { ExecutionTypeEnum } from '../enums'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { NotificationStatusEnum } from '../../../core/enums/notification-status.enum'

@Entity('v2executions')
export class Execution {

  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  public type!: ExecutionTypeEnum

  @Column({ name: 'status', nullable: false, type: 'varchar' })
  public status!: DeploymentStatusEnum

  @Column({ name: 'notification_status', type: 'varchar' })
  public notificationStatus!: NotificationStatusEnum

  @Column({ name: 'deployment_id' })
  public deploymentId!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @Column({ name: 'finished_at' })
  public finishedAt!: Date

  @JoinColumn({ name: 'deployment_id' })
  @ManyToOne(() => DeploymentEntity, deployment => deployment.executions)
  public deployment!: DeploymentEntity

  @Column({ name: 'incoming_circle_id', type: 'varchar' })
  public incomingCircleId: string | null

  constructor(
    deployment: DeploymentEntity,
    type: ExecutionTypeEnum,
    incomingCircleId: string | null,
    status: DeploymentStatusEnum,
  ) {
    this.deployment = deployment
    this.type = type
    this.incomingCircleId = incomingCircleId
    this.status = status
  }

}
