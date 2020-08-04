import { PrimaryColumn, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { DeploymentEntityV2 as DeploymentEntity } from './deployment.entity';
import { Component } from '../../../core/integrations/spinnaker/interfaces'

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

  @Column({ name: 'name' })
  public name!: string

  @Column({ name: 'running', default: false })
  public running!: boolean

  @Column({ name: 'component_id' })
  public componentId! : string

  @JoinColumn({ name: 'deployment_id' })
  @ManyToOne(() => DeploymentEntity, deployment => deployment.components)
  deployment!: DeploymentEntity

  constructor(helmUrl: string, buildImageTag: string, buildImageUrl: string, componentName: string, componentId: string) {
    this.helmUrl = helmUrl
    this.imageTag = buildImageTag
    this.imageUrl = buildImageUrl
    this.name = componentName
    this.componentId = componentId
  }

  public fromDto(dto: ComponentCreateDTO) : ComponentEntityV2{
    return new ComponentEntityV2(dto.helmUrl, dto.imageTag, dto.imageUrl, dto.name, dto.componentId)
  }

  public toDto() : ReadComponentDTO {
    return {
      id: this.id,
      helmUrl: this.helmUrl,
      imageTag: this.imageTag,
      imageUrl: this.imageUrl,
      name: this.name,
      running: this.running
    }
  }
}


export interface ComponentCreateDTO {
  id: string
  name: string
  imageUrl: string
  imageTag: string
  helmUrl: string
  componentId: string
}

export interface ReadComponentDTO {
  id: string
  helmUrl: string
  imageTag: string
  imageUrl: string
  name: string
  running: boolean
}

