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

  @Column({ name: 'component_name' })
  public componentName: string

  @Column({ name: 'build_image_url' })
  public buildImageUrl: string

  @Column({ name: 'build_image_tag' })
  public buildImageTag: string

  @Column({ name: 'context_path' })
  public contextPath: string

  @Column({ name: 'health_check' })
  public healthCheck: string

  @Column({ name: 'port' })
  public port: number

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    componentId: string,
    componentName: string,
    buildImageUrl: string,
    buildImageTag: string,
    contextPath: string,
    healthCheck: string,
    port: number
  ) {
    super()
    this.id = uuidv4()
    this.componentId = componentId
    this.componentName = componentName
    this.buildImageUrl = buildImageUrl
    this.buildImageTag = buildImageTag
    this.contextPath = contextPath
    this.healthCheck = healthCheck
    this.port = port
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadComponentDeploymentDto {
    return new ReadComponentDeploymentDto(
      this.id,
      this.componentId,
      this.componentName,
      this.buildImageUrl,
      this.buildImageTag,
      this.contextPath,
      this.healthCheck,
      this.port,
      this.status,
      this.createdAt
    )
  }
}
