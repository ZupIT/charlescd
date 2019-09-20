import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, OneToMany, PrimaryColumn, CreateDateColumn
} from 'typeorm'
import { DeploymentEntity } from './deployment.entity'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { ReadModuleDeploymentDto } from '../dto'
import { DeploymentStatusEnum } from '../enums'
import * as uuidv4 from 'uuid/v4'

@Entity('module_deployments')
export class ModuleDeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @ManyToOne(
    type => DeploymentEntity,
    deployment => deployment.modules,
  )
  @JoinColumn({ name: 'deployment_id' })
  public deployment: DeploymentEntity

  @Column({ name: 'module_id' })
  public moduleId: string

  @Column({ name: 'k8s_configuration_id' })
  public k8sConfigurationId: string

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @OneToMany(
    type => ComponentDeploymentEntity,
    componentDeployment => componentDeployment.moduleDeployment,
    { cascade: true, eager: true }
  )
  public components: ComponentDeploymentEntity[]

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    moduleId: string,
    k8sConfigurationId: string,
    components: ComponentDeploymentEntity[]
  ) {
    super()
    this.id = uuidv4()
    this.moduleId = moduleId
    this.k8sConfigurationId = k8sConfigurationId
    this.components = components
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadModuleDeploymentDto {
    return new ReadModuleDeploymentDto(
      this.id,
      this.moduleId,
      this.components.map(component => component.toReadDto()),
      this.status,
      this.createdAt
    )
  }
}
