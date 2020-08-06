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

  @Column({ name: 'name' })
  public name!: string

  @Column({ name: 'running', default: false })
  public running!: boolean

  @Column({ name: 'component_id' })
  public componentId! : string

  @JoinColumn({ name: 'deployment_id' })
  @ManyToOne(() => DeploymentEntity, deployment => deployment.components)
  deployment!: DeploymentEntity

  constructor(
    helmUrl: string,
    buildImageTag: string,
    buildImageUrl: string,
    componentName: string,
    componentId: string
  ) {
    this.helmUrl = helmUrl
    this.imageTag = buildImageTag
    this.imageUrl = buildImageUrl
    this.name = componentName
    this.componentId = componentId
  }

  public clone(): ComponentEntityV2 {
    return new ComponentEntityV2(
      this.helmUrl,
      this.imageTag,
      this.imageUrl,
      this.name,
      this.componentId
    )
  }
}
