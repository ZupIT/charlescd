import { IPipelineOptions } from '../interfaces'

export class ReadComponentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly pipelineOptions: IPipelineOptions

  public readonly createdAt: Date

  constructor(
    id: string,
    componentId: string,
    pipelineOptions: IPipelineOptions,
    createdAt: Date
  ) {
    this.id = id
    this.componentId = componentId
    this.pipelineOptions = pipelineOptions
    this.createdAt = createdAt
  }
}
