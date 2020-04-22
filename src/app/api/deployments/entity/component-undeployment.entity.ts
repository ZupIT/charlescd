import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { UndeploymentStatusEnum } from '../enums'
import { ModuleUndeploymentEntity } from './module-undeployment.entity'
import * as uuidv4 from 'uuid/v4'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { ReadComponentUndeploymentDto } from '../dto'

@Entity('component_undeployments')
export class ComponentUndeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @OneToOne(type => ComponentDeploymentEntity)
  @JoinColumn({ name: 'component_deployment_id' })
  public componentDeployment: ComponentDeploymentEntity

  @ManyToOne(
    type => ModuleUndeploymentEntity,
    moduleUndeployment => moduleUndeployment.componentUndeployments
  )
  @JoinColumn({ name: 'module_undeployment_id' })
  public moduleUndeployment: ModuleUndeploymentEntity

  @Column({ name: 'status' })
  public status: UndeploymentStatusEnum

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date


  @Column({ name: 'finished_at' } )
  public finishedAt: Date

  constructor(
    componentDeployment: ComponentDeploymentEntity
  ) {
    super()
    this.id = uuidv4()
    this.componentDeployment = componentDeployment
    this.status = UndeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadComponentUndeploymentDto {
    return new ReadComponentUndeploymentDto(
      this.id,
      this.componentDeployment.id,
      this.status,
      this.createdAt
    )
  }
}
