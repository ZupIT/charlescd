import { IPipelineOptions } from '../interfaces'

export class ReadComponentDto {

  public readonly id: string

  public readonly pipelineOptions: IPipelineOptions

  public readonly createdAt: Date

  constructor(
    id: string,
    pipelineOptions: IPipelineOptions,
    createdAt: Date
  ) {
    this.id = id
    this.pipelineOptions = pipelineOptions
    this.createdAt = createdAt
  }
}
