import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ReadComponentDto } from '../dto'
import { ModuleEntity } from './module.entity'
import { IPipelineOptions } from '../interfaces'

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

  @Column({
    type: 'jsonb',
    name: 'pipeline_options'
  })
  public pipelineOptions: IPipelineOptions

  constructor(
    componentId: string,
    pipelineOptions: IPipelineOptions
  ) {
    super()
    this.componentId = componentId
    this.pipelineOptions = pipelineOptions
  }

  public async updatePipelineOptions(pipelineOptions: IPipelineOptions): Promise<void> {
    this.pipelineOptions = pipelineOptions
  }

  public toReadDto(): ReadComponentDto {
    return new ReadComponentDto(
      this.id,
      this.componentId,
      this.pipelineOptions
    )
  }
}
