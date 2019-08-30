import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ReadComponentDto } from '../dto'
import { ModuleEntity } from '../../modules/entity'
import { IPipelineOptions } from '../interfaces'
import * as uuidv4 from 'uuid/v4'

@Entity()
export class ComponentEntity extends BaseEntity {

  @PrimaryColumn({ name: 'id' })
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
    this.id = uuidv4()
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
