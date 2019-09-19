import { ReadComponentDto } from '../../components/dto'

export class ReadModuleDto {

  public readonly id: string

  public readonly components: ReadComponentDto[]

  public readonly createdAt: Date

  constructor(
    id: string,
    components: ReadComponentDto[],
    createdAt: Date
  ) {
    this.id = id
    this.components = components
    this.createdAt = createdAt
  }
}
