import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DeploymentEntity } from './deployment.entity'
import { UndeploymentStatusEnum } from '../enums'

@Entity('undeployments')
export class UndeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number

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
    this.authorId = authorId
    this.deployment = deployment
  }

  // public toReadDto(): ReadUndeploymentDto {
  //   return new ReadUndeploymentDto(
  //     this.id
  //   )
  // }
}
