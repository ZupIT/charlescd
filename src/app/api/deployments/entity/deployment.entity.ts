import { ModuleDeploymentEntity } from './module-deployment.entity'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ReadDeploymentDto } from '../dto'
import { CircleDeploymentEntity } from './circle-deployment.entity'
import { plainToClass } from 'class-transformer'
import { DeploymentStatusEnum } from '../enums'
import * as uuidv4 from 'uuid/v4'

@Entity('deployments')
export class DeploymentEntity extends BaseEntity {

  @PrimaryColumn({name: 'id'})
  public id: string

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

  @Column({
    type: 'jsonb',
    name: 'circles',
    transformer: {
      from: circles => circles.map(
        circle => plainToClass(CircleDeploymentEntity, circle)
      ),
      to: circles => circles
    }
  })
  public circles: CircleDeploymentEntity[]

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    modules: ModuleDeploymentEntity[],
    authorId: string,
    description: string,
    callbackUrl: string,
    circles: CircleDeploymentEntity[],
    defaultCircle: boolean
  ) {
    super()
    this.id = uuidv4()
    this.modules = modules
    this.authorId = authorId
    this.description = description
    this.callbackUrl = callbackUrl
    this.circles = circles
    this.defaultCircle = defaultCircle
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadDeploymentDto {
    return new ReadDeploymentDto(
      this.id,
      this.modules.map(module => module.toReadDto()),
      this.authorId,
      this.description,
      this.circles.map(circle => circle.toReadDto()),
      this.status,
      this.callbackUrl,
      this.defaultCircle,
      this.createdAt
    )
  }
}
