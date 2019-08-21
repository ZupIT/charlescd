import { BaseEntity, Column, Entity } from 'typeorm'
import { PrimaryGeneratedColumn } from 'typeorm/browser'
import { QueuedDeploymentStatusEnum } from '../enums'

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
}
