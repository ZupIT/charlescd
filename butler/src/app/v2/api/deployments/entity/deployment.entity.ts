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

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity'
import { ReadDeploymentDto } from '../dto/read-deployment.dto'
import { ReadModuleDeploymentDto } from '../dto/read-module-deployment.dto'
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

  @JoinColumn({ name: 'cd_configuration_id' })
  @ManyToOne(() => CdConfigurationEntity, cdConfiguration => cdConfiguration.deployments)
  public cdConfiguration!: CdConfigurationEntity

  @OneToMany(() => Execution, execution => execution.deployment)
  public executions!: Execution[]

  @Column({ name: 'circle_id', nullable: true, type: 'varchar' })
  public circleId!: string | null

  @Column({ name: 'active' })
  public active!: boolean

  @OneToMany(() => ComponentEntity, component => component.deployment, { cascade: ['insert', 'update'] })
  public components!: ComponentEntity[]

  constructor(
    deploymentId: string,
    authorId: string,
    circleId: string | null,
    cdConfiguration: CdConfigurationEntity,
    callbackUrl: string,
    components: ComponentEntity[]
  ) {
    this.id = deploymentId
    this.authorId = authorId
    this.circleId = circleId
    this.cdConfiguration = cdConfiguration
    this.callbackUrl = callbackUrl
    this.components = components
  }

  public toReadDto(): ReadDeploymentDto {
    return this.circleId ?
      this.getCircleDto(this.circleId) :
      this.getDefaultDto()
  }

  private getCircleDto(circleId: string): ReadDeploymentDto {
    return {
      id: this.id,
      applicationName: this.cdConfiguration.id,
      authorId: this.authorId,
      callbackUrl: this.callbackUrl,
      circle: { headerValue: circleId },
      createdAt: this.createdAt,
      description: '',
      modulesDeployments: [this.componentsToModules()],
      defaultCircle: false
    }
  }

  private getDefaultDto(): ReadDeploymentDto {
    return {
      id: this.id,
      applicationName: this.cdConfiguration.id,
      authorId: this.authorId,
      callbackUrl: this.callbackUrl,
      circle: undefined,
      createdAt: this.createdAt,
      description: '',
      modulesDeployments: [this.componentsToModules()],
      defaultCircle: false
    }
  }

  public componentsToModules(): ReadModuleDeploymentDto {
    // TODO returning dummy values on id and moduleId because we dont have the Module entity on v2
    return {
      id: 'dummy-id',
      moduleId: 'dummy-module-id',
      helmRepository: this.components[0].helmUrl,
      createdAt: this.createdAt,
      componentsDeployments: this.components.map(c => {
        return {
          id: c.id,
          createdAt: this.createdAt,
          buildImageTag: c.imageTag,
          buildImageUrl: c.imageUrl,
          componentId: c.componentId,
          componentName: c.name,
          hostValue: c.hostValue,
          gatewayName: c.gatewayName
        }
      })
    }
  }
}
