import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ReadModuleDto } from '../dto'
import { ComponentEntity } from '../../components/entity/component.entity'
import * as uuidv4 from 'uuid/v4'

@Entity()
export class ModuleEntity extends BaseEntity {

  @PrimaryColumn({
    name: 'id',
    type: 'uuid'
  })
  public id: string

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
    components: ComponentEntity[]
  ) {
    super()
    this.id = moduleId
    this.components = components
  }

  public async addComponent(component: ComponentEntity): Promise<void> {
    this.components = [...this.components, component]
  }

  public getComponentById(componentId: string): ComponentEntity {
    return this.components.find(component => component.id === componentId)
  }

  public toReadDto(): ReadModuleDto {
    return new ReadModuleDto(
      this.id,
      this.components.map(component => component.toReadDto()),
      this.createdAt
    )
  }
}
