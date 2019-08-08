import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column, ManyToOne, JoinColumn
} from 'typeorm'
import { ReadComponentDeploymentDto } from '../dto'
import { Deployment } from './deployment.entity'
import { ModuleDeployment } from './module-deployment.entity'

@Entity('component_deployments')
export class ComponentDeployment extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @ManyToOne(
    type => ModuleDeployment,
    moduleDeployment => moduleDeployment.components
  )
  @JoinColumn({ name: 'module_deployment_id' })
  public moduleDeployment: ModuleDeployment

  @Column()
  public componentId: string

  @Column()
  public buildImageTag: string

  @Column()
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
