import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm'
import { DeploymentEntity } from './deployment.entity'
import { ComponentDeploymentEntity } from './component-deployment.entity'
import { ReadModuleDeploymentDto } from '../dto'
import { DeploymentStatusEnum } from '../enums'
import { v4 as uuidv4 } from 'uuid'

@Entity('module_deployments')
export class ModuleDeploymentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
  public id: string

  @ManyToOne(
    type => DeploymentEntity,
    deployment => deployment.modules,
  )
  @JoinColumn({ name: 'deployment_id' })
  public deployment!: DeploymentEntity

  @Column({ name: 'module_id' })
  public moduleId: string

  @Column({ name: 'helm_repository' })
  public readonly helmRepository: string

  @Column({ name: 'status' })
  public status: DeploymentStatusEnum

  @OneToMany(
    type => ComponentDeploymentEntity,
    componentDeployment => componentDeployment.moduleDeployment,
    { cascade: true, eager: true }
  )
  public components: ComponentDeploymentEntity[] | null | undefined

  @CreateDateColumn({ name: 'created_at'})
  public createdAt!: Date

  constructor(
    moduleId: string,
    helmRepository: string,
    components: ComponentDeploymentEntity[] | null | undefined
  ) {
    super()
    this.id = uuidv4()
    this.moduleId = moduleId
    this.helmRepository = helmRepository
    this.components = components
    this.status = DeploymentStatusEnum.CREATED
  }

  public toReadDto(): ReadModuleDeploymentDto {
    return new ReadModuleDeploymentDto(
      this.id,
      this.moduleId,
      this.helmRepository,
      this.components?.map(component => component.toReadDto()),
      this.status,
      this.createdAt
    )
  }
}
