import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { Deployment } from './deployment.entity'
import { ComponentDeployment } from './component-deployment.entity'

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

  @Column({ name: 'components' })
  public components: ComponentDeployment[]

  constructor(
    moduleId: string,
    components: ComponentDeployment[]
  ) {
    super()
    this.moduleId = moduleId
    this.components = components
  }
}
