import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm'
import { ReadComponentDeploymentDto } from '../dto'
import { ModuleDeploymentEntity } from './module-deployment.entity'
import { DeploymentStatusEnum } from '../enums'
import { v4 as uuidv4 } from 'uuid'

@Entity('component_deployments')
export class ComponentDeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @ManyToOne(
    type => ModuleDeploymentEntity,
    moduleDeployment => moduleDeployment.components
  )
  @JoinColumn({ name: 'module_deployment_id' })
  public moduleDeployment!: ModuleDeploymentEntity

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'component_name' })
  public componentName: string

  @Column({ name: 'build_image_url' })
  public buildImageUrl: string

  @Column({ name: 'build_image_tag' })
  public buildImageTag: string

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt!: Date

  @Column({ name: 'finished_at'})
  public finishedAt: Date

  constructor(
    componentId: string,
    componentName: string,
    buildImageUrl: string,
    buildImageTag: string
  ) {
    super()
    this.id = uuidv4()
    this.componentId = componentId
    this.componentName = componentName
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadComponentDeploymentDto {
    return new ReadComponentDeploymentDto(
      this.id,
      this.componentId,
      this.componentName,
      this.buildImageUrl,
      this.buildImageTag,
      this.status,
      this.createdAt
    )
  }
}
