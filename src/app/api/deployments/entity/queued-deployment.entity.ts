import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { QueuedPipelineStatusEnum, QueuedPipelineTypesEnum } from '../enums'
import { ReadQueuedDeploymentDto } from '../dto'

@Entity('queued_deployments')
export class QueuedDeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'component_deployment_id' })
  public componentDeploymentId: string

  @Column({ name: 'status' })
  public status: QueuedPipelineStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  @Column({ name: 'type' })
  public type: QueuedPipelineTypesEnum

  constructor(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum,
    type: QueuedPipelineTypesEnum
  ) {
    super()
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.status = status
    this.type = type
  }

  public toReadDto(): ReadQueuedDeploymentDto {
    return new ReadQueuedDeploymentDto(
      this.id,
      this.componentId,
      this.componentDeploymentId,
      this.status,
      this.createdAt,
      this.type
    )
  }
}
