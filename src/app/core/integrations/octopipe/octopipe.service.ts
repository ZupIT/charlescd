import { forwardRef, HttpService, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AxiosResponse } from 'axios'
import { Repository } from 'typeorm'
import { IPipelineCircle, IPipelineOptions } from '../../../api/components/interfaces'
import { ICdConfigurationData, IOctopipeConfigurationData } from '../../../api/configurations/interfaces'
import {
  ComponentDeploymentEntity, ComponentUndeploymentEntity, DeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity, QueuedUndeploymentEntity
} from '../../../api/deployments/entity'
import { QueuedPipelineTypesEnum } from '../../../api/deployments/enums'
import { ComponentDeploymentsRepository, ComponentUndeploymentsRepository, QueuedDeploymentsRepository } from '../../../api/deployments/repository'
import { PipelineErrorHandlerService } from '../../../api/deployments/services'
import { IoCTokensConstants } from '../../constants/ioc'
import { ConsoleLoggerService } from '../../logs/console'
import { IBaseVirtualService, IEmptyVirtualService } from '../cd/spinnaker/connector/interfaces'
import createDestinationRules from '../cd/spinnaker/connector/utils/manifests/base-destination-rules'
import { createEmptyVirtualService, createVirtualService } from '../cd/spinnaker/connector/utils/manifests/base-virtual-service'
import IEnvConfiguration from '../configuration/interfaces/env-configuration.interface'
import { GitProvider } from '../configuration/interfaces/git-providers'

interface IOctopipeVersion {
  version: string
  versionUrl: string
}

export interface IOctopipeConfiguration {
  hosts?: string[],
  versions: IOctopipeVersion[],
  unusedVersions: IOctopipeVersion[],
  istio: {
    virtualService: {},
    destinationRules: {}
  },
  appName: string,
  appNamespace: string
  webHookUrl: string,
  git: {
    provider: GitProvider,
    token: string
  },
  helmUrl: string,
  k8s: {
    config: any
  }
}

@Injectable()
export class OctopipeService {

  constructor(
    private readonly httpService: HttpService,
    private readonly consoleLoggerService: ConsoleLoggerService,
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
  ) { }

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    configurationData: ICdConfigurationData,
    componentDeploymentId: string,
    deploymentId: string,
    circleId: string,
    pipelineCallbackUrl: string,
    queueId: number
  ): Promise<void> {

    const componentDeploymentEntity: ComponentDeploymentEntity =
      await this.componentDeploymentsRepository.getOneWithRelations(componentDeploymentId)
    const payload: IOctopipeConfiguration =
      this.createPipelineConfigurationObject(
        pipelineCirclesOptions,
        configurationData as IOctopipeConfigurationData,
        pipelineCallbackUrl,
        componentDeploymentEntity.moduleDeployment,
        componentDeploymentEntity.componentName
      )

    this.deploy(payload, deploymentId, queueId, configurationData as IOctopipeConfigurationData)
  }

  public async deploy(
    payload: IOctopipeConfiguration,
    deploymentId: string,
    queueId: number,
    configurationData: IOctopipeConfigurationData
  ): Promise<AxiosResponse<any> | { error: any }> {

    try {
      this.consoleLoggerService.log(`START:DEPLOY_OCTOPIPE_PIPELINE`)
      const octopipeResponse = await this.httpService.post(
        `${configurationData.url}/api/v1/pipeline`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).toPromise()
      this.consoleLoggerService.log(`FINISH:DEPLOY_OCTOPIPE_PIPELINE`)
      return octopipeResponse
    } catch (error) {
      this.consoleLoggerService.error(error)
      await this.handleDeploymentFailure(deploymentId, queueId)
      return { error: error.message }
    }
  }

  public createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IOctopipeConfigurationData,
    pipelineCallbackUrl: string,
    moduleDeployment: ModuleDeploymentEntity,
    appName: string
  ): IOctopipeConfiguration {

    const payload = {
      appName,
      appNamespace: deploymentConfiguration.namespace,
      git: {
        provider: deploymentConfiguration.gitProvider,
        token: deploymentConfiguration.gitToken
      },
      k8s: {
        config: deploymentConfiguration.k8sConfig
      },
      helmUrl: moduleDeployment.helmRepository,
      istio: { virtualService: {}, destinationRules: {} },
      unusedVersions: pipelineCirclesOptions.pipelineUnusedVersions,
      versions: this.concatAppNameAndVersion(pipelineCirclesOptions.pipelineVersions, appName),
      webHookUrl: pipelineCallbackUrl
    }

    payload.istio.virtualService = this.buildVirtualServices(
      appName,
      deploymentConfiguration.namespace,
      pipelineCirclesOptions.pipelineCircles,
      pipelineCallbackUrl,
      [appName],
      pipelineCirclesOptions.pipelineVersions
    )
    payload.istio.destinationRules = createDestinationRules(
      appName,
      deploymentConfiguration.namespace,
      pipelineCirclesOptions.pipelineCircles,
      pipelineCirclesOptions.pipelineVersions
    )

    return payload
  }

  private concatAppNameAndVersion(versions: IOctopipeVersion[], appName: string) {
    return versions.map(version => {
      return {
        ...version,
        version: `${appName}-${version.version}`
      }
    })
  }

  private async handleDeploymentFailure(deploymentId: string, queueId: number): Promise<void> {
    this.consoleLoggerService.error(`ERROR:DEPLOY_OCTOPIPE_PIPELINE ${deploymentId} ${queueId}`)
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

  private buildVirtualServices(
    appName: string, appNamespace: string, circles: IPipelineCircle[], uri: string, hosts: string[], versions: IOctopipeVersion[]
  ) {
    const virtualService: IBaseVirtualService | IEmptyVirtualService =
      versions.length === 0
        ? createEmptyVirtualService(appName, appNamespace)
        : createVirtualService(appName, appNamespace, circles, uri, hosts)
    return virtualService
  }
}
