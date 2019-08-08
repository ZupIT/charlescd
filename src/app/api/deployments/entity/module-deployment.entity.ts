import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, OneToMany
} from 'typeorm'
import { Deployment } from './deployment.entity'
import { ComponentDeployment } from './component-deployment.entity'
import { ReadModuleDeploymentDto } from '../dto/read-module-deployment.dto'

@Entity('module_deployments')
export class ModuleDeployment extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @ManyToOne(
    type => Deployment,
    deployment => deployment.modules
  )
  @JoinColumn({ name: 'deployment_id' })
  public deployment: Deployment

  @Column({ name: 'module_id' })
  public moduleId: string

  @OneToMany(
    type => ComponentDeployment,
    componentDeployment => componentDeployment.moduleDeployment,
    { cascade: true, eager: true }
  )
  public components: ComponentDeployment[]

  constructor(
    moduleId: string,
    components: ComponentDeployment[]
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
