import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { DeploymentEntity } from './deployment.entity'
import { UndeploymentStatusEnum } from '../enums'
import { ReadUndeploymentDto } from '../dto'
import * as uuidv4 from 'uuid/v4'

@Entity('undeployments')
export class UndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @Column({ name: 'user_id' })
  public authorId: string

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  @OneToOne(type => DeploymentEntity)
  @JoinColumn({ name: 'deployment_id' })
  public deployment: DeploymentEntity

  @Column({ name: 'status'} )
  public status: UndeploymentStatusEnum

  constructor(
    authorId: string,
    deployment: DeploymentEntity
  ) {
    super()
    this.id = uuidv4()
    this.authorId = authorId
    this.deployment = deployment
    this.status = UndeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadUndeploymentDto {
    return new ReadUndeploymentDto(
      this.id,
      this.authorId,
      this.createdAt,
      this.deployment.id,
      this.status
    )
  }
}
