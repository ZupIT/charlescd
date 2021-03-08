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

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ReadComponentDeploymentDto } from '../dto/read-component-deployment.dto'
import { ReadDeploymentDto } from '../dto/read-deployment.dto'
import { Deployment } from '../interfaces'
import { ComponentEntityV2 as ComponentEntity } from './component.entity'
import { Execution } from './execution.entity'

@Entity('v2deployments')
export class DeploymentEntityV2 implements Deployment {

  @PrimaryColumn({ name: 'id' })
  public id!: string

  @Column({ name: 'author_id' })
  public authorId!: string

  @Column({ name: 'callback_url' })
  public callbackUrl!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @Column()
  public priority!: number

  @OneToMany(() => Execution, execution => execution.deployment)
  public executions!: Execution[]

  @Column({ name: 'circle_id', nullable: false, type: 'varchar' })
  public circleId!: string

  @Column({ name: 'previous_deployment_id', nullable: false, type: 'varchar' })
  public previousDeploymentId!: string | null

  @Column({ name: 'current' })
  public current!: boolean

  @Column({ name: 'namespace' })
  public namespace: string

  @Column({ name: 'healthy' })
  public healthy!: boolean

  @Column({ name: 'routed' })
  public routed!: boolean

  @Column({ name: 'timeout_in_seconds' })
  public timeoutInSeconds: number

  @OneToMany(() => ComponentEntity, component => component.deployment, { cascade: ['insert', 'update'] })
  public components!: ComponentEntity[]

  @Column({ name: 'default_circle' })
  public defaultCircle!: boolean

  constructor(
    deploymentId: string,
    authorId: string,
    circleId: string,
    callbackUrl: string,
    components: ComponentEntity[],
    defaultCircle: boolean,
    namespace: string,
    timeoutInSeconds: number
  ) {
    this.id = deploymentId
    this.authorId = authorId
    this.circleId = circleId
    this.callbackUrl = callbackUrl
    this.components = components
    this.defaultCircle = defaultCircle
    this.namespace = namespace
    this.timeoutInSeconds = timeoutInSeconds
  }

  public toReadDto(): ReadDeploymentDto {
    return {
      id: this.id
    }
  }

  public formatComponents(): ReadComponentDeploymentDto[] {
    return this.components.map(c => {
      return {
        id: c.id,
        createdAt: this.createdAt,
        buildImageTag: c.imageTag,
        buildImageUrl: c.imageUrl,
        componentId: c.componentId,
        componentName: c.name,
        hostValue: c.hostValue,
        gatewayName: c.gatewayName,
        helmRepository: c.helmUrl
      }
    })
  }
}
