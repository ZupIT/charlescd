import { ReadComponentDto } from '../../components/dto'

export class ReadModuleDto {

  public readonly id: string

  public readonly components: ReadComponentDto[]

  public readonly createdAt: Date

  public readonly k8sConfigurationId: string

  constructor(
    id: string,
    components: ReadComponentDto[],
    createdAt: Date,
    k8sConfigurationId: string
  ) {
    this.id = id
    this.components = components
    this.createdAt = createdAt
    this.k8sConfigurationId = k8sConfigurationId
  }
}
