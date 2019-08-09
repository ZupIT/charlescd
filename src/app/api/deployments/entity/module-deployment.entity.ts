import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, OneToMany
} from 'typeorm'
import { DeploymentEntity } from './deployment.entity'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { ReadModuleDeploymentDto } from '../dto'

@Entity('module_deployments')
export class ModuleDeploymentEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @ManyToOne(
    type => DeploymentEntity,
    deployment => deployment.modules
  )
  @JoinColumn({ name: 'deployment_id' })
  public deployment: DeploymentEntity

  @Column({ name: 'module_id' })
  public moduleId: string

  @OneToMany(
    type => ComponentDeploymentEntity,
    componentDeployment => componentDeployment.moduleDeployment,
    { cascade: true, eager: true }
  )
  public components: ComponentDeploymentEntity[]

  constructor(
    moduleId: string,
    components: ComponentDeploymentEntity[]
  ) {
    super()
    this.moduleId = moduleId
    this.components = components
  }

  public toReadDto(): ReadModuleDeploymentDto {
    return new ReadModuleDeploymentDto(
      this.id,
      this.moduleId,
      this.components.map(component => component.toReadDto())
    )
  }
}
