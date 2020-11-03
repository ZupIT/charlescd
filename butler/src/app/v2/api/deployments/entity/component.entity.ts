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

import { PrimaryColumn, Column, Entity, ManyToOne, JoinColumn } from 'typeorm'
import { DeploymentEntityV2 as DeploymentEntity } from './deployment.entity'
import { Component } from '../interfaces'

@Entity('v2components')
export class ComponentEntityV2 implements Component {

  @PrimaryColumn('uuid')
  public id!: string

  @Column({ name: 'helm_url' })
  public helmUrl!: string

  @Column({ name: 'image_tag' })
  public imageTag!: string

  @Column({ name: 'image_url' })
  public imageUrl!: string

  @Column({ name: 'host_value', nullable: true, type: 'varchar' })
  public hostValue!: string | null

  @Column({ name: 'gateway_name', nullable: true, type: 'varchar' })
  public gatewayName!: string | null

  @Column({ name: 'name' })
  public name!: string

  @Column({ name: 'running', default: false })
  public running!: boolean

  @Column({ name: 'component_id' })
  public componentId!: string

  @Column({ name: 'merged' })
  public merged! : boolean

  @JoinColumn({ name: 'deployment_id' })
  @ManyToOne(() => DeploymentEntity, deployment => deployment.components)
  public deployment!: DeploymentEntity

  constructor(
    helmUrl: string,
    buildImageTag: string,
    buildImageUrl: string,
    componentName: string,
    componentId: string,
    hostValue: string | null,
    gatewayName: string | null,
    merged = false
  ) {
    this.helmUrl = helmUrl
    this.imageTag = buildImageTag
    this.imageUrl = buildImageUrl
    this.name = componentName
    this.componentId = componentId
    this.hostValue = hostValue
    this.gatewayName = gatewayName
    this.merged = merged
  }

  public clone(): ComponentEntityV2 {
    return new ComponentEntityV2(
      this.helmUrl,
      this.imageTag,
      this.imageUrl,
      this.name,
      this.componentId,
      this.hostValue,
      this.gatewayName,
      true
    )
  }
}
