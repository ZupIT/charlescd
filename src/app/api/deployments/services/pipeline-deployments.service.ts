import {
    forwardRef,
    Inject,
    Injectable
} from '@nestjs/common'
import { ConsoleLoggerService } from '../../../core/logs/console'
import {
    ComponentDeploymentEntity,
    DeploymentEntity
} from '../entity'
import { ComponentEntity } from '../../components/entity'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { SpinnakerService } from '../../../core/integrations/spinnaker'

@Injectable()
export class PipelineDeploymentsService {

    constructor(
        private readonly consoleLoggerService: ConsoleLoggerService,
        private readonly deploymentConfigurationService: DeploymentConfigurationService,
        @Inject(forwardRef(() => SpinnakerService))
        private readonly spinnakerService: SpinnakerService,
    ) {}

    public async triggerComponentDeployment(
        componentEntity: ComponentEntity,
        deploymentEntity: DeploymentEntity,
        componentDeployment: ComponentDeploymentEntity,
        pipelineCallbackUrl: string,
        queueId: number
    ): Promise<void> {

        try {
            const deploymentConfiguration: IDeploymentConfiguration =
                await this.deploymentConfigurationService.getConfiguration(componentDeployment.id)

            await this.spinnakerService.createDeployment(
                componentEntity.pipelineOptions, deploymentConfiguration, componentDeployment.id,
                deploymentEntity.id, deploymentEntity.circleId, pipelineCallbackUrl, queueId
            )
        } catch (error) {
            throw error
        }
    }
}
