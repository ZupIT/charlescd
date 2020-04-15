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

  @Column({ name: 'cd_configuration_id'})
  public cdConfigurationId: string | null

  @OneToMany(
    type => ComponentEntity,
    componentEntity => componentEntity.module,
    { cascade: true, eager: true }
  )
  public components: ComponentEntity[]

  @CreateDateColumn({ name: 'created_at'})
  public createdAt!: Date

  constructor(
    moduleId: string,
    cdConfigurationId: string | null,
    components: ComponentEntity[]
  ) {
    super()
    this.id = moduleId
    this.cdConfigurationId = cdConfigurationId
    this.components = components
  }

  public toReadDto(): ReadModuleDto {
    return new ReadModuleDto(
      this.id,
      this.components.map(component => component.toReadDto()),
      this.createdAt,
      this.cdConfigurationId
    )
  }
}
