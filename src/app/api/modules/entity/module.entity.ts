import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm'
import { ReadModuleDto } from '../dto'
import { ComponentEntity } from '../../components/entity'

@Entity('modules')
export class ModuleEntity extends BaseEntity {

  @PrimaryColumn({
    name: 'id',
    type: 'uuid'
  })
  public id: string

  @Column({ name: 'k8s_config_id'})
  public k8sConfigurationId: string

  @OneToMany(
    type => ComponentEntity,
    componentEntity => componentEntity.module,
    { cascade: true, eager: true }
  )
  public components: ComponentEntity[]

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    moduleId: string,
    k8sConfigurationId: string,
    components: ComponentEntity[]
  ) {
    super()
    this.id = moduleId
    this.k8sConfigurationId = k8sConfigurationId
    this.components = components
  }

  public toReadDto(): ReadModuleDto {
    return new ReadModuleDto(
      this.id,
      this.components.map(component => component.toReadDto()),
      this.createdAt,
      this.k8sConfigurationId
    )
  }
}
