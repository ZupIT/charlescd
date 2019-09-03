import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ReadModuleDto } from '../dto'
import { ComponentEntity } from '../../components/entity/component.entity'
import * as uuidv4 from 'uuid/v4'

@Entity()
export class ModuleEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
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
    this.id = uuidv4()
    this.moduleId = moduleId
    this.components = components
  }

  public async addComponent(component: ComponentEntity): Promise<void> {
    this.components = [...this.components, component]
  }

  public getComponentById(componentId: string): ComponentEntity {
    return this.components.find(component => component.componentId === componentId)
  }

  public toReadDto(): ReadModuleDto {
    return new ReadModuleDto(
      this.id,
      this.moduleId,
      this.components.map(component => component.toReadDto())
    )
  }
}
