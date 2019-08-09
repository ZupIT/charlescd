import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ReadComponentDto } from '../dto'
import { ModuleEntity } from './module.entity'

@Entity()
export class ComponentEntity extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({
    name: 'component_id',
    unique: true
  })
  public componentId: string

  @ManyToOne(
    type => ModuleEntity,
    moduleEntity => moduleEntity.components
  )
  @JoinColumn({ name: 'module_id' })
  public module: ModuleEntity[]

  constructor(
    componentId: string
  ) {
    super()
    this.componentId = componentId
  }

  public toReadDto(): ReadComponentDto {
    return new ReadComponentDto(
      this.id,
      this.componentId
    )
  }
}
