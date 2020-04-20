import { ReadComponentDto } from '../../components/dto'

export class ReadModuleDto {

  public readonly id: string

  public readonly components: ReadComponentDto[]

  public readonly createdAt: Date

  public readonly cdConfigurationId: string

  constructor(
    id: string,
    components: ReadComponentDto[],
    createdAt: Date,
    cdConfigurationId: string
  ) {
    this.id = id
    this.components = components
    this.createdAt = createdAt
    this.cdConfigurationId = cdConfigurationId
  }
}
