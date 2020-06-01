import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'
import {
  QueuedPipelineStatusEnum,
} from '../enums'
import { ReadQueuedIstioDeploymentDto } from '../dto'

@Entity('queued_istio_deployments')
export class QueuedIstioDeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ name: 'deployment_id' })
  public deploymentId: string

  @Column({ name: 'component_id' })
  public componentId: string

  @Column({ name: 'component_deployment_id' })
  public componentDeploymentId: string

  @Column({ name: 'circle_id' })
  public circleId: string

  @Column({ name: 'status' })
  public status: QueuedPipelineStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt!: Date

  constructor(
    deploymentId: string,
    componentId: string,
    componentDeploymentId: string,
    circleId: string,
    status: QueuedPipelineStatusEnum
  ) {
    super()
    this.deploymentId = deploymentId
    this.componentId = componentId
    this.componentDeploymentId = componentDeploymentId
    this.circleId = circleId
    this.status = status
  }

  public toReadDto(): ReadQueuedIstioDeploymentDto {
    return new ReadQueuedIstioDeploymentDto(
      this.id,
      this.deploymentId,
      this.componentId,
      this.componentDeploymentId,
      this.circleId,
      this.status,
      this.createdAt
    )
  }

  public isRunning(): boolean {
    return this.status === QueuedPipelineStatusEnum.RUNNING
  }
}
