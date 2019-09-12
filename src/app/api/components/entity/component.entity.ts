import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { ReadComponentDto } from '../dto'
import { ModuleEntity } from '../../modules/entity'
import { IPipelineOptions } from '../interfaces'
import * as uuidv4 from 'uuid/v4'

@Entity()
export class ComponentEntity extends BaseEntity {

  @PrimaryColumn({
    name: 'id'
  })
  public id: string

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

  @CreateDateColumn({ name: 'created_at'})
  public createdAt: Date

  constructor(
    componentId: string,
    pipelineOptions: IPipelineOptions
  ) {
    super()
    this.id = componentId
    this.pipelineOptions = pipelineOptions
  }

  public async updatePipelineOptions(pipelineOptions: IPipelineOptions): Promise<void> {
    this.pipelineOptions = pipelineOptions
  }

  public toReadDto(): ReadComponentDto {
    return new ReadComponentDto(
      this.id,
      this.pipelineOptions,
      this.createdAt
    )
  }
}
