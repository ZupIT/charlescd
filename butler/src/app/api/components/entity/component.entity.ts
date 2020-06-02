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
import { ReadComponentDto } from '../dto'
import { ModuleEntity } from '../../modules/entity'
import {
  IPipelineOptions,
  IDeploymentVersion
} from '../interfaces'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity
} from '../../deployments/entity'
import { AppConstants } from '../../../core/constants'

@Entity('components')
export class ComponentEntity extends BaseEntity {

  @PrimaryColumn({
    name: 'id',
    type: 'uuid'
  })
  public id: string

  @ManyToOne(
    () => ModuleEntity,
    moduleEntity => moduleEntity.components
  )
  @JoinColumn({ name: 'module_id' })
  public module!: ModuleEntity

  @Column({
    type: 'jsonb',
    name: 'pipeline_options'
  })
  public pipelineOptions: IPipelineOptions

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  constructor(
    componentId: string
  ) {
    super()
    this.id = componentId
    this.pipelineOptions = { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }
  }

  public toReadDto(): ReadComponentDto {
    return new ReadComponentDto(
      this.id,
      this.pipelineOptions,
      this.createdAt
    )
  }

  public setPipelineDefaultCircle(componentDeployment: ComponentDeploymentEntity): void {
    this.removeCurrentDefaultCircle()
    this.addDefaultCircle(componentDeployment)
    this.setUnusedVersions()
    this.addVersion(componentDeployment)
  }

  public setPipelineCircle(circle: CircleDeploymentEntity, componentDeployment: ComponentDeploymentEntity): void {
    this.removeCurrentCircleRule(circle)
    this.addCircleRule(circle, componentDeployment)
    this.setUnusedVersions()
    this.addVersion(componentDeployment)
  }

  public unsetPipelineCircle(circle: CircleDeploymentEntity): void {
    this.removeCurrentCircleRule(circle)
    this.setUnusedVersions()
  }

  public removePipelineCircle(circle: CircleDeploymentEntity): void {
    this.removeCurrentCircleRule(circle)
  }

  private removeCurrentCircleRule(circle: CircleDeploymentEntity): void {
    this.pipelineOptions.pipelineCircles = this.pipelineOptions.pipelineCircles.filter(
      pipelineCircle => !pipelineCircle.header || pipelineCircle.header.headerValue !== circle.headerValue
    )
  }

  private removeCurrentDefaultCircle(): void {
    this.pipelineOptions.pipelineCircles = this.pipelineOptions.pipelineCircles.filter(pipelineCircle => {
      return !!pipelineCircle.header
    })
  }

  private addDefaultCircle(componentDeployment: ComponentDeploymentEntity): void {
    this.pipelineOptions.pipelineCircles.push({
      destination: {
        version: componentDeployment.buildImageTag
      }
    })
  }

  private addCircleRule(circle: CircleDeploymentEntity, componentDeployment: ComponentDeploymentEntity): void {
    this.pipelineOptions.pipelineCircles.unshift({
      header: {
        headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME,
        headerValue: circle.headerValue
      },
      destination: {
        version: componentDeployment.buildImageTag
      }
    })
  }

  private setUnusedVersions(): void {
    const currentVersions: IDeploymentVersion[] = this.pipelineOptions.pipelineVersions.filter(pipelineVersion =>
      !!this.pipelineOptions.pipelineCircles.find(
        pipelineCircle => pipelineCircle.destination.version === pipelineVersion.version
      )
    )
    const unusedVersions: IDeploymentVersion[] =
      this.pipelineOptions.pipelineVersions.filter(pipelineVersion => !currentVersions.includes(pipelineVersion))

    this.pipelineOptions.pipelineVersions = currentVersions
    this.pipelineOptions.pipelineUnusedVersions = unusedVersions
  }

  private addVersion(componentDeployment: ComponentDeploymentEntity): void {
    this.pipelineOptions.pipelineVersions = this.pipelineOptions.pipelineVersions.filter(
      pipelineVersion => pipelineVersion.version !== componentDeployment.buildImageTag
    )
    this.pipelineOptions.pipelineVersions.push({
      versionUrl: componentDeployment.buildImageUrl,
      version: componentDeployment.buildImageTag
    })
  }
}
