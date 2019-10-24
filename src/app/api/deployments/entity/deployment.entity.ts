import { ModuleDeploymentEntity } from './module-deployment.entity'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ReadDeploymentDto } from '../dto'
import { CircleDeploymentEntity } from './circle-deployment.entity'
import { plainToClass } from 'class-transformer'
import { DeploymentStatusEnum } from '../enums'

@Entity('deployments')
export class DeploymentEntity extends BaseEntity {

  @PrimaryColumn({name: 'id'})
  public id: string

  @Column({ name: 'value_flow_id' })
  public valueFlowId: string

  @OneToMany(
    type => ModuleDeploymentEntity,
    moduleDeployment => moduleDeployment.deployment,
    { cascade: true }
  )
  public modules: ModuleDeploymentEntity[]

  @Column({ name: 'user_id' })
  public authorId: string

  @Column({ name: 'description'} )
  public description: string

  @Column({ name: 'callback_url'} )
  public callbackUrl: string

  @Column({ name: 'status'} )
  public status: DeploymentStatusEnum

  @Column({ name: 'default_circle', nullable: true } )
  public defaultCircle: boolean

  @Column({ name: 'circle_id', nullable: true } )
  public circleId: string

  @Column({
    type: 'jsonb',
    name: 'circle',
    transformer: {
      from: circle => plainToClass(CircleDeploymentEntity, circle),
      to: circle => circle
    }
  })
  public circle: CircleDeploymentEntity

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    deploymentId: string,
    valueFlowId: string,
    modules: ModuleDeploymentEntity[],
    authorId: string,
    description: string,
    callbackUrl: string,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean,
    circleId: string
  ) {
    super()
    this.id = deploymentId
    this.valueFlowId = valueFlowId
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.callbackUrl = callbackUrl
    this.circle = circle
    this.defaultCircle = defaultCircle
    this.status = DeploymentStatusEnum.CREATED
    this.circleId = circleId
  }

  public toReadDto(): ReadDeploymentDto {
    return new ReadDeploymentDto(
      this.id,
      this.valueFlowId,
      this.modules.map(module => module.toReadDto()),
      this.authorId,
      this.description,
      this.circle.toReadDto(),
      this.status,
      this.callbackUrl,
      this.defaultCircle,
      this.createdAt
    )
  }

  public hasFinished(): boolean {
    return this.status === DeploymentStatusEnum.FINISHED
  }

  public hasFailed(): boolean {
    return this.status === DeploymentStatusEnum.FAILED
  }
}
