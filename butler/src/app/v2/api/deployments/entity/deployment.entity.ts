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
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity'
import { DeploymentStatusEnum } from '../../../../v1/api/deployments/enums'
import { Deployment } from '../../../core/integrations/spinnaker/interfaces'
import { ComponentEntityV2 as ComponentEntity } from './component.entity'
import { Execution } from './execution.entity'

@Entity('v2deployments')
export class DeploymentEntityV2 implements Deployment {

  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'external_id' })
  public deploymentId!: string

  @Column({ name: 'author_id' })
  public authorId!: string

  @Column({ name: 'callback_url' })
  public callbackUrl!: string

  @Column({ name: 'status', nullable: false, type: 'varchar' })
  public status!: DeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @Column({ name: 'finished_at' })
  public finishedAt!: Date

  @JoinColumn({ name: 'cd_configuration_id' })
  @ManyToOne(() => CdConfigurationEntity, cdConfiguration => cdConfiguration.deployments)
  cdConfiguration!: CdConfigurationEntity

  @OneToMany(() => Execution, execution => execution.deployment)
  public executions!: Execution[]


  @Column({ name: 'circle_id', nullable: true, type: 'varchar' })
  public circleId!: string | null

  @OneToMany(() => ComponentEntity, component => component.deployment, { cascade: ['insert', 'update'] })
  public components!: ComponentEntity[]

  constructor(
    deploymentId: string,
    authorId: string,
    status: DeploymentStatusEnum,
    circleId: string | null,
    cdConfiguration: CdConfigurationEntity,
    callbackUrl: string,
    components: ComponentEntity[]
  ) {
    this.deploymentId = deploymentId
    this.authorId = authorId
    this.status = status
    this.circleId = circleId
    this.cdConfiguration = cdConfiguration
    this.callbackUrl = callbackUrl
    this.components = components
  }

  public hasSucceeded(): boolean {
    return this.status === DeploymentStatusEnum.SUCCEEDED
  }

  public hasFailed(): boolean {
    return this.status === DeploymentStatusEnum.FAILED
  }
}
