import {
    CreateModuleDeploymentDto
} from '../'
import {
    CreateDeploymentRequestDto
} from './'
import {
    CircleDeploymentEntity,
    DeploymentEntity
} from '../../entity'

export class CreateDefaultDeploymentRequestDto extends CreateDeploymentRequestDto {

    constructor(
        deploymentId: string,
        applicationName: string,
        modules: CreateModuleDeploymentDto[],
        authorId: string,
        description: string,
        callbackUrl: string
    ) {
        super()
        this.deploymentId = deploymentId
        this.applicationName = applicationName
        this.modules = modules
        this.authorId = authorId
        this.description = description
        this.callbackUrl = callbackUrl
    }

    public toEntity(requestCircleId: string): DeploymentEntity {
        return new DeploymentEntity(
            this.deploymentId,
            this.applicationName,
            this.modules.map(module => module.toEntity()),
            this.authorId,
            this.description,
            this.callbackUrl,
            {} as CircleDeploymentEntity,
            true,
            requestCircleId
        )
    }
}
