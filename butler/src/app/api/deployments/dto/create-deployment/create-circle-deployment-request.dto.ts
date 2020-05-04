import {
    CreateCircleDeploymentDto,
    CreateModuleDeploymentDto
} from '../'
import {
    CreateDeploymentRequestDto
} from './'
import { DeploymentEntity } from '../../entity'
import {
    IsDefined,
    ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCircleDeploymentRequestDto extends CreateDeploymentRequestDto {

    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => CreateCircleDeploymentDto)
    public readonly circle: CreateCircleDeploymentDto

    constructor(
        deploymentId: string,
        applicationName: string,
        modules: CreateModuleDeploymentDto[],
        authorId: string,
        description: string,
        callbackUrl: string,
        circle: CreateCircleDeploymentDto
    ) {
        super()
        this.deploymentId = deploymentId
        this.applicationName = applicationName
        this.modules = modules
        this.authorId = authorId
        this.description = description
        this.callbackUrl = callbackUrl
        this.circle = circle
    }

    public toEntity(requestCircleId: string): DeploymentEntity {
        return new DeploymentEntity(
            this.deploymentId,
            this.applicationName,
            this.modules.map(module => module.toEntity()),
            this.authorId,
            this.description,
            this.callbackUrl,
            this.circle.toEntity(),
            false,
            requestCircleId
        )
    }
}
