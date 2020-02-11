import {
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common'
import { ModuleEntity } from '../../modules/entity'
import { ComponentEntity } from '../../components/entity'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  DeploymentEntity
} from '../entity'
import {
  IPipelineCircle,
  IPipelineOptions,
  IPipelineVersion
} from '../../components/interfaces'
import { SpinnakerService } from '../../../core/integrations/spinnaker'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console'
import { ComponentDeploymentsRepository } from '../repository'
import { AppConstants } from '../../../core/constants'
import { IDeploymentConfiguration } from '../../../core/integrations/configuration/interfaces'
import { DeploymentStatusEnum } from '../enums'
import { StatusManagementService } from '../../../core/services/deployments/'
import { DeploymentConfigurationService } from '../../../core/integrations/configuration'
import { IConsulKV } from '../../../core/integrations/consul/interfaces'

@Injectable()
export class PipelinesService {

  constructor(
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(forwardRef(() => SpinnakerService))
    private readonly spinnakerService: SpinnakerService,
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @InjectRepository(ComponentEntity)
    private readonly componentsRepository: Repository<ComponentEntity>,
    private readonly deploymentsStatusManagementService: StatusManagementService,
    private readonly deploymentConfigurationService: DeploymentConfigurationService,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @Inject(AppConstants.CONSUL_PROVIDER)
    private readonly consulConfiguration: IConsulKV
  ) {}

  public async triggerUndeployment(
      componentDeploymentId: string,
      queueId: number
  ): Promise<void> {

    try {
      const pipelineCallbackUrl: string = this.getUndeploymentCallbackUrl(queueId)
      await this.processUndeploymentPipeline(componentDeploymentId)
      await this.triggerPipelineDeployment(componentDeploymentId, pipelineCallbackUrl, queueId)
    } catch (error) {
      throw error
    }
  }

  public async triggerDeployment(componentDeploymentId: string, queueId: number): Promise<void> {

    try {
      const pipelineCallbackUrl: string = this.getDeploymentCallbackUrl(queueId)
      await this.triggerPipelineDeployment(componentDeploymentId, pipelineCallbackUrl, queueId)
    } catch (error) {
      throw error
    }
  }

  private getDeploymentCallbackUrl(queuedDeploymentId: number): string {
    return `${this.consulConfiguration.darwinDeploymentCallbackUrl}?queuedDeploymentId=${queuedDeploymentId}`
  }

  private getUndeploymentCallbackUrl(queuedUndeploymentId: number): string {
    return `${this.consulConfiguration.darwinUndeploymentCallbackUrl}?queuedUndeploymentId=${queuedUndeploymentId}`
  }

  private async processUndeploymentPipeline(componentDeploymentId: string): Promise<void> {

    try {
      const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
      const { circle } = componentDeployment.moduleDeployment.deployment
      const component: ComponentEntity =
        await this.componentsRepository.findOne({ id: componentDeployment.componentId })
      this.removeCircleFromPipeline(component.pipelineOptions, circle)
      this.removeUnusedPipelineVersions(component.pipelineOptions)
      await this.componentsRepository.save(component)
    } catch (error) {
      return Promise.reject({ error })
    }
  }

  private async deployComponentPipeline(
    componentDeployment: ComponentDeploymentEntity,
    deploymentId: string,
    pipelineCallbackUrl: string,
    queueId: number
  ): Promise<void> {

    const componentEntity: ComponentEntity =
      await this.componentsRepository.findOne({ id: componentDeployment.componentId })

    const deploymentConfiguration: IDeploymentConfiguration =
      await this.deploymentConfigurationService.getConfiguration(componentDeployment.id)

    const deploymentEntity: DeploymentEntity =
      await this.deploymentsRepository.findOne({ id: deploymentId })

    await this.spinnakerService.createDeployment(
      componentEntity.pipelineOptions,
      deploymentConfiguration,
      componentDeployment.id,
      deploymentId,
      deploymentEntity.circleId,
      pipelineCallbackUrl,
      queueId
    )
  }

  public async deployComponent(
      componentDeploymentEntity: ComponentDeploymentEntity,
      pipelineCallbackUrl: string,
      queueId: number
  ): Promise<void> {

    const { moduleDeployment: { deployment: { id: deploymentId } } } = componentDeploymentEntity
    await this.deployComponentPipeline(componentDeploymentEntity, deploymentId, pipelineCallbackUrl, queueId)
  }

  private async triggerPipelineDeployment(
      componentDeploymentId: string,
      pipelineCallbackUrl: string,
      queueId: number
  ): Promise<void> {

    this.consoleLoggerService.log(`START:PROCESS_COMPONENT_DEPLOYMENT`, { componentDeploymentId })
    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    await this.deployComponent(componentDeploymentEntity, pipelineCallbackUrl, queueId)
    this.consoleLoggerService.log(`FINISH:PROCESS_COMPONENT_DEPLOYMENT`, { componentDeploymentId })
  }

  private removeUnusedPipelineVersions(
    pipelineOptions: IPipelineOptions
  ): void {

    const currentVersions = pipelineOptions.pipelineVersions.filter(
      pipelineVersion => this.checkVersionUsage(pipelineVersion, pipelineOptions.pipelineCircles)
    )

    const unusedVersions = pipelineOptions.pipelineVersions.filter(v => !currentVersions.includes(v))

    pipelineOptions.pipelineVersions = currentVersions
    pipelineOptions.pipelineUnusedVersions = unusedVersions

  }

  private checkVersionUsage(
    pipelineVersion: IPipelineVersion,
    pipelineCircles: IPipelineCircle[]
  ): boolean {

    return !!pipelineCircles.find(pipelineCircle =>
      pipelineCircle.destination.version === pipelineVersion.version
    )
  }

  private removeCircleFromPipeline(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles = pipelineOptions.pipelineCircles.filter(pipelineCircle => {
      return !pipelineCircle.header || pipelineCircle.header.headerValue !== circle.headerValue
    })
  }
}
