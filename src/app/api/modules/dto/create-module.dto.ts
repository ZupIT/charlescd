import { ModuleEntity } from '../entity'
import {
    IsDefined,
    IsNotEmpty,
    ValidateNested
} from 'class-validator'
import { CreateComponentDto } from './'
import { Type } from 'class-transformer'

export class CreateModuleDto {

    @IsNotEmpty()
    public readonly id: string

    @IsNotEmpty()
    public readonly cdConfigurationId: string

    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => CreateComponentDto)
    public readonly components: CreateComponentDto[]

    constructor(
        id: string,
        cdConfigurationId: string,
        components: CreateComponentDto[]
    ) {
        this.id = id
        this.cdConfigurationId = cdConfigurationId
        this.components = components
    }

    public toEntity(): ModuleEntity {
        return new ModuleEntity(
            this.id,
            this.cdConfigurationId,
            this.components.map(component => component.toEntity())
        )
    }
}
