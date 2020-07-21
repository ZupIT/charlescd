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

import { ModuleDeploymentEntity } from './module-deployment.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm'
import { ReadDeploymentDto } from '../dto'
import { CircleDeploymentEntity } from './circle-deployment.entity'
import { plainToClass } from 'class-transformer'
import { DeploymentStatusEnum } from '../enums'

@Entity('deployments')
export class DeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @Column({ name: 'application_name' })
  public applicationName: string

  @OneToMany(
    () => ModuleDeploymentEntity,
    moduleDeployment => moduleDeployment.deployment,
    { cascade: true }
  )
  public modules: ModuleDeploymentEntity[]

  @Column({ name: 'user_id' })
  public authorId: string

  @Column({ name: 'description' })
  public description: string

  @Column({ name: 'callback_url' })
  public callbackUrl: string

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @Column({ name: 'default_circle', nullable: true })
  public defaultCircle: boolean

  @Column({ name: 'circle_id', nullable: true })
  public circleId: string

  @Column({
    type: 'jsonb',
    name: 'circle',
    transformer: {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      from: circle => plainToClass(CircleDeploymentEntity, circle),
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      to: circle => circle
    }
  })
  public circle: CircleDeploymentEntity | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @Column({ name: 'finished_at' })
  public finishedAt!: Date

  @Column({ name: 'cd_configuration_id', type: 'varchar'})
  public cdConfigurationId!: string

  constructor(
    deploymentId: string,
    applicationName: string,
    modules: ModuleDeploymentEntity[],
    authorId: string,
    description: string,
    callbackUrl: string,
    circle: CircleDeploymentEntity | null,
    defaultCircle: boolean,
    circleId: string,
    cdConfigurationId: string
  ) {
    super()
    this.id = deploymentId
    this.applicationName = applicationName
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.callbackUrl = callbackUrl
    this.circle = circle
    this.defaultCircle = defaultCircle
    this.status = DeploymentStatusEnum.CREATED
    this.circleId = circleId
    this.cdConfigurationId = cdConfigurationId
  }

  public toReadDto(): ReadDeploymentDto {
    return new ReadDeploymentDto(
      this.id,
      this.applicationName,
      this.modules?.map(module => module.toReadDto()),
      this.authorId,
      this.description,
      this.status,
      this.callbackUrl,
      this.defaultCircle,
      this.createdAt,
      this.circle ? this.circle.toReadDto() : undefined
    )
  }

  public hasSucceeded(): boolean {
    return this.status === DeploymentStatusEnum.SUCCEEDED
  }

  public hasFailed(): boolean {
    return this.status === DeploymentStatusEnum.FAILED
  }

  public getComponentDeploymentsIds(): string[] {
    return this.modules.reduce((acc, moduleDeployment) => {
      if (moduleDeployment.components) {
        return acc.concat(moduleDeployment.components.map(component => component.id))
      }
      return acc
    }, [] as string[])
  }
}
