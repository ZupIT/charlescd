import { IPipelineOptions } from '../interfaces'

export class ReadComponentDto {

  public readonly id: string

  public readonly componentId: string

  public readonly pipelineOptions: IPipelineOptions

  constructor(
    id: string,
    componentId: string,
    pipelineOptions: IPipelineOptions
  ) {
    this.id = id
    this.componentId = componentId
    this.pipelineOptions = pipelineOptions
  }
}
