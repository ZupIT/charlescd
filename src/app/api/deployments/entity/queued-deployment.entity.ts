import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance
} from 'typeorm'
import {
  QueuedPipelineStatusEnum,
  QueuedPipelineTypesEnum
} from '../enums'
import { ReadQueuedDeploymentDto } from '../dto'

@Entity('queued_deployments')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class QueuedDeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'component_deployment_id' })
  public componentDeploymentId: string

  @Column({ name: 'status' })
  public status: QueuedPipelineStatusEnum

  @Column({ name: 'type' })
  public type: QueuedPipelineTypesEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    componentId: string,
    componentDeploymentId: string,
    status: QueuedPipelineStatusEnum
  ) {
    super()
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.status = status
    this.type = QueuedPipelineTypesEnum.QueuedDeploymentEntity
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
