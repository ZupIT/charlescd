import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column, ManyToOne, JoinColumn
} from 'typeorm'
import { ReadComponentDeploymentDto } from '../dto'
import { DeploymentEntity } from './deployment.entity'
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

  @Column({ name: 'build_image_tag' })
  public buildImageTag: string

  @Column({ name: 'build_image_name' })
  public buildImageName: string

  constructor(
    componentId: string,
    buildImageTag: string,
    buildImageName: string
  ) {
    super()
    this.componentId = componentId
    this.buildImageTag = buildImageTag
    this.buildImageName = buildImageName
  }

  public toReadDto() {
    return new ReadComponentDeploymentDto(
      this.id,
      this.componentId,
      this.buildImageTag,
      this.buildImageName
    )
  }
}
