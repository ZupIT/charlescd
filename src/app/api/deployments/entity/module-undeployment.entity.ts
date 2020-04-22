import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { UndeploymentStatusEnum } from '../enums'
import { ComponentUndeploymentEntity } from './component-undeployment.entity'
import { UndeploymentEntity } from './undeployment.entity'
import * as uuidv4 from 'uuid/v4'
import { ModuleDeploymentEntity } from './module-deployment.entity'
import { ReadModuleUndeploymentDto } from '../dto'

@Entity('module_undeployments')
export class ModuleUndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @OneToOne(type => ModuleDeploymentEntity)
  @JoinColumn({ name: 'module_deployment_id' })
  public moduleDeployment: ModuleDeploymentEntity

  @ManyToOne(
    type => UndeploymentEntity,
    undeployment => undeployment.moduleUndeployments,
  )
  @JoinColumn({ name: 'undeployment_id' })
  public undeployment: UndeploymentEntity

  @OneToMany(
    type => ComponentUndeploymentEntity,
    componentUndeployment => componentUndeployment.moduleUndeployment,
    { cascade: true }
  )
  public componentUndeployments: ComponentUndeploymentEntity[]

  @Column({ name: 'status' })
  public status: UndeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  @Column({ name: 'finished_at' })
  public finishedAt: Date

  constructor(
    moduleDeployment: ModuleDeploymentEntity,
    componentUndeployments: ComponentUndeploymentEntity[]
  ) {
    super()
    this.id = uuidv4()
    this.moduleDeployment = moduleDeployment
    this.componentUndeployments = componentUndeployments
    this.status = UndeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadModuleUndeploymentDto {
    return new ReadModuleUndeploymentDto(
      this.id,
      this.moduleDeployment.id,
      this.componentUndeployments.map(component => component.toReadDto()),
      this.status,
      this.createdAt
    )
  }
}
