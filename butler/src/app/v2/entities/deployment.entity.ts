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
import { ComponentEntity, ReadComponentDTO } from './component.entity'
import { DeploymentStatusEnum } from '../../v1/api/deployments/enums'
import { CdConfigurationEntity } from '../../v1/api/configurations/entity'
import { ReadCdConfigurationDto } from '../../v1/api/configurations/dto'
import { Deployment } from '../interfaces'

@Entity('v2deployments')
export class DeploymentEntity implements Deployment {

  @PrimaryGeneratedColumn('uuid')
  public id!: string

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

  @Column({ name: 'circle_id', nullable: true, type: 'varchar'})
  public circleId!: string | null

  @OneToMany(() => ComponentEntity, component => component.deployment, { cascade:  ['insert']})
  public components!: ComponentEntity[]

  constructor(id: string, authorId: string, status: DeploymentStatusEnum, circleId: string | null, cdConfiguration: CdConfigurationEntity) {
    this.id = id
    this.authorId = authorId
    this.status = status
    this.circleId = circleId
    this.cdConfiguration = cdConfiguration
  }

  public fromDto(dto: CreateDeploymentDTO) : DeploymentEntity{
    return new DeploymentEntity(dto.id, dto.authorId, dto.status, dto.circleId, dto.cdConfiguration)
  }

  public toDto() : ReadDeploymentDTO{
    return {
      id: this.id,
      authorId: this.authorId,
      callbackUrl: this.callbackUrl,
      cdConfiguration: this.cdConfiguration,
      circleId: this.circleId,
      status: this.status ? this.status : DeploymentStatusEnum.CREATED,
      components: this.components
    }
  }

  public hasSucceeded(): boolean {
    return this.status === DeploymentStatusEnum.SUCCEEDED
  }

  public hasFailed(): boolean {
    return this.status === DeploymentStatusEnum.FAILED
  }
}

  interface CreateDeploymentDTO {
    id: string
    authorId: string
    callbackUrl: string
    cdConfiguration: CdConfigurationEntity
    circleId: string | null
    status: DeploymentStatusEnum
  }

  interface ReadDeploymentDTO {
    id: string
    authorId: string
    callbackUrl: string
    cdConfiguration: ReadCdConfigurationDto
    circleId: string | null
    status: DeploymentStatusEnum
    components: ReadComponentDTO[]
  }
