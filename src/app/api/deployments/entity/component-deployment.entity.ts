import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ReadComponentDeploymentDto } from '../dto'
import { ModuleDeploymentEntity } from './module-deployment.entity'

@Entity('component_deployments')
export class ComponentDeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @ManyToOne(
    type => ModuleDeploymentEntity,
    moduleDeployment => moduleDeployment.components
  )
  @JoinColumn({ name: 'module_deployment_id' })
  public moduleDeployment: ModuleDeploymentEntity

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'build_image_url' })
  public buildImageUrl: string

  @Column({ name: 'build_image_tag' })
  public buildImageTag: string

  constructor(
    componentId: string,
    buildImageUrl: string,
    buildImageTag: string
  ) {
    super()
    this.componentId = componentId
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
  }

  public toReadDto(): ReadComponentDeploymentDto {
    return new ReadComponentDeploymentDto(
      this.id,
      this.componentId,
      this.buildImageUrl,
      this.buildImageTag
    )
  }
}
