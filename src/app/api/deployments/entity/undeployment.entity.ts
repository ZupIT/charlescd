import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { DeploymentEntity } from './deployment.entity'
import { UndeploymentStatusEnum } from '../enums'
import { ReadUndeploymentDto } from '../dto'
import { v4 as uuidv4 } from 'uuid'
import { ModuleUndeploymentEntity } from './module-undeployment.entity'
import { ModuleDeploymentEntity } from './module-deployment.entity'
import { ComponentUndeploymentEntity } from './component-undeployment.entity'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { NotFoundException } from '@nestjs/common'

@Entity('undeployments')
export class UndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @Column({ name: 'user_id' })
  public authorId: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @OneToOne(type => DeploymentEntity)
  @JoinColumn({ name: 'deployment_id' })
  public deployment: DeploymentEntity

  @OneToMany(
    type => ModuleUndeploymentEntity,
    moduleUndeployment => moduleUndeployment.undeployment,
    { cascade: true }
  )
  public moduleUndeployments: ModuleUndeploymentEntity[]

  @Column({ name: 'status' })
  public status: UndeploymentStatusEnum

  @Column({ name: 'circle_id', nullable: false })
  public circleId: string

  @Column({ name: 'finished_at'})
  public finishedAt: Date

  constructor(
    authorId: string,
    deployment: DeploymentEntity,
    circleId: string
  ) {
    super()
    this.id = uuidv4()
    this.authorId = authorId
    this.deployment = deployment
    this.status = UndeploymentStatusEnum.CREATED
    this.moduleUndeployments = this.createModuleUndeploymentsArray(deployment)
    this.circleId = circleId
  }

  public toReadDto(): ReadUndeploymentDto {
    return new ReadUndeploymentDto(
      this.id,
      this.authorId,
      this.createdAt,
      this.deployment.id,
      this.status,
      this.circleId,
      this.moduleUndeployments.map(module => module.toReadDto())
    )
  }

  public hasFinished(): boolean {
    return this.status === UndeploymentStatusEnum.FINISHED
  }

  public hasFailed(): boolean {
    return this.status === UndeploymentStatusEnum.FAILED
  }

  public getComponentUndeployments(): ComponentUndeploymentEntity[] {
    return this.moduleUndeployments.reduce(
      (accumulated, moduleUndeployment) => {
        if (!moduleUndeployment.componentUndeployments) { return accumulated }
        return [...accumulated, ...moduleUndeployment.componentUndeployments]
      }, [] as ComponentUndeploymentEntity[]
    )
  }

  private createModuleUndeploymentsArray(deployment: DeploymentEntity): ModuleUndeploymentEntity[] {
    return deployment?.modules.map(
      moduleDeployment => this.createModuleUndeployment(moduleDeployment)
    )
  }

  private createModuleUndeployment(moduleDeployment: ModuleDeploymentEntity): ModuleUndeploymentEntity {
    const componentUndeployments: ComponentUndeploymentEntity[] = this.createComponentUndeploymentsArray(moduleDeployment)

    return new ModuleUndeploymentEntity(
      moduleDeployment,
      componentUndeployments
    )
  }

  private createComponentUndeploymentsArray(moduleDeployment: ModuleDeploymentEntity): ComponentUndeploymentEntity[] {
    return moduleDeployment.components.map(
      componentDeployment => this.createComponentUndeployment(componentDeployment)
    )
  }

  private createComponentUndeployment(componentDeployment: ComponentDeploymentEntity): ComponentUndeploymentEntity {
    return new ComponentUndeploymentEntity(
      componentDeployment
    )
  }
}
