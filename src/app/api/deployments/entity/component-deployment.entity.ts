import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn
} from 'typeorm'
import { ReadComponentDeploymentDto } from '../dto'
import { ModuleDeploymentEntity } from './module-deployment.entity'
import { DeploymentStatusEnum } from '../enums'
import * as uuidv4 from 'uuid/v4'

@Entity('component_deployments')
export class ComponentDeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
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

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    componentId: string,
    buildImageUrl: string,
    buildImageTag: string
  ) {
    super()
    this.id = uuidv4()
    this.componentId = componentId
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadComponentDeploymentDto {
    return new ReadComponentDeploymentDto(
      this.id,
      this.componentId,
      this.buildImageUrl,
      this.buildImageTag,
      this.status,
      this.createdAt
    )
  }
}
