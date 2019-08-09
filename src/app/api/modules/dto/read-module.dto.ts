import { ReadComponentDto } from './read-component.dto'

export class ReadModuleDto {

  public readonly id: string

  public readonly moduleId: string

  public readonly components: ReadComponentDto[]

  constructor(
    id: string,
    moduleId: string,
    components: ReadComponentDto[]
  ) {
    this.id = id
    this.moduleId = moduleId
    this.components = components
  }
}
