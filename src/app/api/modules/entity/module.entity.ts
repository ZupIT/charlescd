import {
  BaseEntity, Column,
  Entity, OneToMany, PrimaryGeneratedColumn
} from 'typeorm'
import { ReadModuleDto } from '../dto'
import { ComponentEntity } from './component.entity'

@Entity()
export class ModuleEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({
    name: 'module_id',
    unique: true
  })
  public moduleId: string

  @OneToMany(
    type => ComponentEntity,
    componentEntity => componentEntity.module,
    { cascade: true, eager: true }
  )
  public components: ComponentEntity[]

  constructor(
    moduleId: string,
    components: ComponentEntity[]
  ) {
    super()
    this.moduleId = moduleId
    this.components = components
  }

  public toReadDto(): ReadModuleDto {
    return new ReadModuleDto(
      this.id,
      this.moduleId,
      this.components.map(component => component.toReadDto())
    )
  }
}
