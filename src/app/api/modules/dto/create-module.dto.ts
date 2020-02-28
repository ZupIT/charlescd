import {
    ModuleEntity
} from '../entity'
import { Allow } from 'class-validator'
import { CreateComponentDto } from './'

export class CreateModuleDto {

    @Allow()
    public readonly id: string

    @Allow()
    public readonly k8sConfigurationId: string

    @Allow()
    public readonly components: CreateComponentDto[]

    constructor(
        id: string,
        k8sConfigurationId: string,
        components: CreateComponentDto[]
    ) {
        this.id = id
        this.k8sConfigurationId = k8sConfigurationId
        this.components = components
    }

    public toEntity(): ModuleEntity {
        return new ModuleEntity(
            this.id,
            this.k8sConfigurationId,
            this.components.map(component => component.toEntity())
        )
    }
}
