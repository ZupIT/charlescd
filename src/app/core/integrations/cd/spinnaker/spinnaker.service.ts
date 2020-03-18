import {
  forwardRef,
  HttpService,
  Inject,
  Injectable
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IPipelineOptions } from '../../../../api/components/interfaces'
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  QueuedDeploymentEntity,
  QueuedUndeploymentEntity
} from '../../../../api/deployments/entity'
import { QueuedPipelineTypesEnum } from '../../../../api/deployments/enums'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../../../api/deployments/repository'
import { PipelineErrorHandlerService } from '../../../../api/deployments/services'
import { AppConstants } from '../../../constants'
import { IoCTokensConstants } from '../../../constants/ioc'
import { ConsoleLoggerService } from '../../../logs/console'
import { IDeploymentConfiguration } from '../../configuration/interfaces'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import TotalPipeline from './connector'
import {
  ICreateSpinnakerApplication,
  ISpinnakerPipelineConfiguration
} from './interfaces'
import {
  ICdConfigurationData,
  ISpinnakerConfigurationData
} from '../../../../api/configurations/interfaces'

@Injectable()
export class SpinnakerService {

  constructor(
    private readonly httpService: HttpService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration,
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    @InjectRepository(QueuedDeploymentsRepository)
    private readonly queuedDeploymentsRepository: QueuedDeploymentsRepository,
    @InjectRepository(ComponentUndeploymentsRepository)
    private readonly componentUndeploymentsRepository: ComponentUndeploymentsRepository,
    @InjectRepository(ComponentDeploymentsRepository)
    private readonly componentDeploymentsRepository: ComponentDeploymentsRepository,
    @Inject(forwardRef(() => PipelineErrorHandlerService))
    private readonly pipelineErrorHandlingService: PipelineErrorHandlerService
  ) {}

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    configurationData: ICdConfigurationData,
    componentDeploymentId: string,
    deploymentId: string,
    circleId: string,
    pipelineCallbackUrl: string,
    queueId: number
  ): Promise<void> {

    this.consoleLoggerService.log(
      'START:CREATE_SPINNAKER_PIPELINE',
      { pipelineCirclesOptions, configurationData, componentDeploymentId, deploymentId }
    )

    const componentDeploymentEntity: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)

    const deploymentConfiguration: IDeploymentConfiguration =
        this.getConfigurationObject(configurationData as ISpinnakerConfigurationData, componentDeploymentEntity)

    const spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration =
      this.createPipelineConfigurationObject(
        pipelineCirclesOptions, deploymentConfiguration, circleId, pipelineCallbackUrl, componentDeploymentEntity.moduleDeployment
      )

    await this.processSpinnakerApplication(deploymentConfiguration)
    await this.processSpinnakerPipeline(spinnakerPipelineConfiguration, deploymentConfiguration)

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE', spinnakerPipelineConfiguration)

    this.deploySpinnakerPipeline(
        spinnakerPipelineConfiguration.pipelineName,
        spinnakerPipelineConfiguration.applicationName,
        deploymentId,
        queueId
    )
  }

  public async deploySpinnakerPipeline(
      pipelineName: string,
      application: string,
      deploymentId: string,
      queueId: number
  ): Promise<void> {

    try {
      await this.waitForPipelineCreation()
      this.consoleLoggerService.log(`START:DEPLOY_SPINNAKER_PIPELINE ${pipelineName} - APPLICATION ${application} `)
      await this.httpService.post(
          `${this.envConfiguration.spinnakerUrl}/pipelines/${application}/${pipelineName}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
      ).toPromise()
      this.consoleLoggerService.log(`FINISH:DEPLOY_SPINNAKER_PIPELINE ${pipelineName}`)
    } catch (error) {
      await this.handleDeploymentFailure(deploymentId, queueId)
    }
  }

  private getConfigurationObject(
      cdConfigurationData: ISpinnakerConfigurationData,
      componentDeploymentEntity: ComponentDeploymentEntity
  ): IDeploymentConfiguration {

    return {
      account: cdConfigurationData.account,
      appNamespace: cdConfigurationData.namespace,
      pipelineName: componentDeploymentEntity.componentId,
      applicationName: `${AppConstants.SPINNAKER_APPLICATION_PREFIX}${componentDeploymentEntity.moduleDeployment.deployment.applicationName}`,
      appName: componentDeploymentEntity.componentName,
      healthCheckPath: componentDeploymentEntity.healthCheck,
      uri: {
        uriName: componentDeploymentEntity.contextPath
      },
      appPort: componentDeploymentEntity.port
    }
  }

  private createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    circleId: string,
    pipelineCallbackUrl: string,
    moduleDeployment: ModuleDeploymentEntity
  ): ISpinnakerPipelineConfiguration {

    return {
      ...deploymentConfiguration,
      webhookUri: pipelineCallbackUrl,
      versions: pipelineCirclesOptions.pipelineVersions,
      unusedVersions: pipelineCirclesOptions.pipelineUnusedVersions,
      circles: pipelineCirclesOptions.pipelineCircles,
      githubAccount: this.envConfiguration.spinnakerGithubAccount,
      helmRepository: moduleDeployment.helmRepository,
      circleId
    }
  }

  private async getSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration
  ) {

    const spinnakerBuilder = new TotalPipeline(spinnakerPipelineConfiguration)

    return spinnakerBuilder.buildPipeline()
  }

  public async waitForPipelineCreation(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 30000)
    })
  }

  private async createSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration
  ): Promise<void> {

    try {
      const pipeline = await this.getSpinnakerPipeline(spinnakerPipelineConfiguration)
      await this.httpService.post(
        `${this.envConfiguration.spinnakerUrl}/pipelines`,
        pipeline,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).toPromise()
    } catch (error) {
      throw error
    }
  }

  private createUpdatePipelineObject(
    pipelineId: string, spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration, pipeline
  ) {
    return {
      ...pipeline,
      id: pipelineId,
      application: spinnakerPipelineConfiguration.applicationName,
      name: spinnakerPipelineConfiguration.pipelineName
    }
  }

  private async updateSpinnakerPipeline(
    spinnakerPipelineConfiguraton: ISpinnakerPipelineConfiguration, pipelineId: string
  ): Promise<void> {

    this.consoleLoggerService.log('START:UPDATE_SPINNAKER_PIPELINE')

    const pipeline = await this.getSpinnakerPipeline(spinnakerPipelineConfiguraton)
    const updatePipelineObject =
      this.createUpdatePipelineObject(pipelineId, spinnakerPipelineConfiguraton, pipeline)

    await this.httpService.post(
      `${this.envConfiguration.spinnakerUrl}/pipelines`,
      updatePipelineObject,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()

    this.consoleLoggerService.log('FINISH:UPDATE_SPINNAKER_PIPELINE')
  }

  private async handleDeploymentFailure(deploymentId: string, queueId: number): Promise<void> {
    this.consoleLoggerService.error(`ERROR:DEPLOY_SPINNAKER_PIPELINE ${deploymentId} ${queueId}`)
    const queuedDeployment: QueuedDeploymentEntity = await this.queuedDeploymentsRepository.findOne({ id: queueId })

    if (queuedDeployment.type === QueuedPipelineTypesEnum.QueuedDeploymentEntity) {
      await this.handleQueuedDeploymentFailure(queuedDeployment, deploymentId)
    } else {
      await this.handleQueuedUndeploymentFailure(queuedDeployment as QueuedUndeploymentEntity)
    }
  }

  private async handleQueuedDeploymentFailure(queuedDeployment: QueuedDeploymentEntity, deploymentId: string): Promise<void> {
    const deployment: DeploymentEntity = await this.deploymentsRepository.findOne({ id: deploymentId })
    const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.findOne({ id: queuedDeployment.componentDeploymentId })

    await this.pipelineErrorHandlingService.handleComponentDeploymentFailure(componentDeployment, queuedDeployment, deployment.circle)
    await this.pipelineErrorHandlingService.handleDeploymentFailure(deployment)
  }

  private async handleQueuedUndeploymentFailure(queuedUndeployment: QueuedUndeploymentEntity): Promise<void> {
    const componentUndeployment: ComponentUndeploymentEntity =
        await this.componentUndeploymentsRepository.getOneWithRelations(queuedUndeployment.componentUndeploymentId)
    const componentDeployment: ComponentDeploymentEntity =
        await this.componentDeploymentsRepository.getOneWithRelations(queuedUndeployment.componentDeploymentId)
    const { moduleUndeployment: { undeployment } } = componentUndeployment

    await this.pipelineErrorHandlingService.handleComponentUndeploymentFailure(componentDeployment, queuedUndeployment)
    await this.pipelineErrorHandlingService.handleUndeploymentFailure(undeployment)
  }

  private async checkPipelineExistence(pipelineName: string, applicationName: string): Promise<string> {
    const { data: { id } } = await this.httpService.get(
      `${this.envConfiguration.spinnakerUrl}/applications/${applicationName}/pipelineConfigs/${pipelineName}`
    ).toPromise()
    return id
  }

  private getCreateSpinnakerApplicationObject(applicationName: string): ICreateSpinnakerApplication {
    return {
      job: [{
        type: AppConstants.SPINNAKER_CREATE_APPLICATION_JOB_TYPE,
        application: {
          cloudProviders: AppConstants.SPINNAKER_CREATE_APPLICATION_DEFAULT_CLOUD,
          instancePort: AppConstants.SPINNAKER_CREATE_APPLICATION_PORT,
          name: applicationName,
          email: AppConstants.SPINNAKER_CREATE_APPLICATION_DEFAULT_EMAIL
        }
      }],
      application: applicationName
    }
  }

  private async createSpinnakerApplication(applicationName: string): Promise<void> {
    const createApplicationObject: ICreateSpinnakerApplication =
      this.getCreateSpinnakerApplicationObject(applicationName)
    this.consoleLoggerService.log('START:CREATE_SPINNAKER_APPLICATION', { createApplicationObject })

    await this.httpService.post(
      `${this.envConfiguration.spinnakerUrl}/tasks`,
      createApplicationObject,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_APPLICATION')
  }

  private async checkSpinnakerApplicationExistence(applicationName: string): Promise<void> {
    await this.httpService.get(
      `${this.envConfiguration.spinnakerUrl}/applications/${applicationName}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
  }

  private async processSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration,
    deploymentConfiguration: IDeploymentConfiguration
  ): Promise<void> {

    const pipelineId: string = await this.checkPipelineExistence(
      spinnakerPipelineConfiguration.pipelineName, deploymentConfiguration.applicationName
    )

    pipelineId ?
      await this.updateSpinnakerPipeline(spinnakerPipelineConfiguration, pipelineId) :
      await this.createSpinnakerPipeline(spinnakerPipelineConfiguration)
  }

  private async processSpinnakerApplication(
    deploymentConfiguration: IDeploymentConfiguration
  ): Promise<void> {

    try {
      await this.checkSpinnakerApplicationExistence(deploymentConfiguration.applicationName)
    } catch (error) {
      await this.createSpinnakerApplication(deploymentConfiguration.applicationName)
    }
  }
}
