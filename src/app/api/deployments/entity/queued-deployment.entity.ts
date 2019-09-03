import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { QueuedDeploymentStatusEnum } from '../enums'
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
  public status: QueuedDeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedDeploymentStatusEnum
  ) {
    super()
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.status = status
  }

  public toReadDto(): ReadQueuedDeploymentDto {
    return new ReadQueuedDeploymentDto(
      this.id,
      this.componentId,
      this.componentDeploymentId,
      this.status,
      this.createdAt
    )
  }
}
