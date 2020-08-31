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

  @Column({ name: 'host_value' })
  public hostValue!: string

  @Column({ name: 'gateway_name' })
  public gatewayName!: string

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

  @Column({ name: 'namespace' })
  public namespace!: string

  public clone(): ComponentEntityV2 {
    return new ComponentEntityV2(
      this.helmUrl,
      this.imageTag,
      this.imageUrl,
      this.name,
      this.componentId,
      this.namespace,
      true
    )
  }

  constructor(
    helmUrl: string,
    buildImageTag: string,
    buildImageUrl: string,
    componentName: string,
    componentId: string,
    namespace: string,
    merged = false,
  ) {
    this.helmUrl = helmUrl
    this.imageTag = buildImageTag
    this.imageUrl = buildImageUrl
    this.name = componentName
    this.componentId = componentId
    this.merged = merged
    this.namespace = namespace
  }
}
