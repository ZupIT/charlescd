import { Inject, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { IPipelineCircle } from '../../../../api/components/interfaces'
import { OctopipeConfigurationData } from '../../../../api/configurations/interfaces'
import { IoCTokensConstants } from '../../../constants/ioc'
import { ConsoleLoggerService } from '../../../logs/console'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import {
  ClusterProviderEnum, IDefaultClusterConfig, IEKSClusterConfig, IOctopipePayload, IOctopipeVersion
} from '../../octopipe/interfaces/octopipe-payload.interface'
import { ICdServiceStrategy, IConnectorConfiguration } from '../interfaces'
import { IBaseVirtualService, IEmptyVirtualService } from '../spinnaker/connector/interfaces'
import createDestinationRules from '../spinnaker/connector/utils/manifests/base-destination-rules'
import { createEmptyVirtualService, createVirtualService } from '../spinnaker/connector/utils/manifests/base-virtual-service'
import { OctopipeApiService } from './octopipe-api.service'

@Injectable()
export class OctopipeService implements ICdServiceStrategy {

  constructor(
    private readonly octopipeApiService: OctopipeApiService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) { }

  public async createDeployment(configuration: IConnectorConfiguration): Promise<void> {

    const payload: IOctopipePayload = this.createPipelineConfigurationObject(configuration)
    await this.deploy(payload)
  }

  public async deploy(
    octopipeConfiguration: IOctopipePayload
  ): Promise<AxiosResponse> {

    try {
      this.consoleLoggerService.log(`START:DEPLOY_OCTOPIPE_PIPELINE`)
      return await this.octopipeApiService.deploy(octopipeConfiguration).toPromise()
    } catch (error) {
      this.consoleLoggerService.error(error)
      throw error
    } finally {
      this.consoleLoggerService.log(`FINISH:DEPLOY_OCTOPIPE_PIPELINE`)
    }
  }

  public createPipelineConfigurationObject(configuration: IConnectorConfiguration): IOctopipePayload {
    const deploymentConfiguration: OctopipeConfigurationData = configuration.cdConfiguration as OctopipeConfigurationData
    let payload = {
      appName: configuration.componentName,
      appNamespace: deploymentConfiguration.namespace,
      git: {
        provider: deploymentConfiguration.gitProvider,
        token: deploymentConfiguration.gitToken
      },
      helmUrl: configuration.helmRepository,
      istio: { virtualService: {}, destinationRules: {} },
      unusedVersions: configuration.pipelineCirclesOptions.pipelineUnusedVersions,
      versions: this.concatAppNameAndVersion(configuration.pipelineCirclesOptions.pipelineVersions, configuration.componentName),
      webHookUrl: configuration.pipelineCallbackUrl,
      circleId: configuration.callbackCircleId
    }
    payload = this.addK8sConfig(payload, deploymentConfiguration)

    payload.istio.virtualService = this.buildVirtualServices(
      configuration.componentName,
      deploymentConfiguration.namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      [configuration.componentName],
      configuration.pipelineCirclesOptions.pipelineVersions
    )

    payload.istio.destinationRules = createDestinationRules(
      configuration.componentName,
      deploymentConfiguration.namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      configuration.pipelineCirclesOptions.pipelineVersions
    )

    return payload
  }

  private concatAppNameAndVersion(versions: IOctopipeVersion[], appName: string): IOctopipeVersion[] {
    return versions.map(version => {
      return Object.assign({}, version, { version: `${appName}-${version.version}` })
    })
  }

  private addK8sConfig(payload: IOctopipePayload, deploymentConfiguration: OctopipeConfigurationData): IOctopipePayload {
    const k8sConfig = this.buildK8sConfig(deploymentConfiguration)
    if (!k8sConfig) {
      return payload
    }
    payload.k8s = k8sConfig
    return payload
  }

  private buildK8sConfig(config: OctopipeConfigurationData): IEKSClusterConfig | IDefaultClusterConfig | null {
    switch (config.provider) {
      case ClusterProviderEnum.EKS:
        return {
          provider: ClusterProviderEnum.EKS,
          caData: config.caData,
          awsSID: config.awsSID,
          awsSecret: config.awsSecret,
          awsRegion: config.awsRegion,
          awsClusterName: config.awsClusterName
        }
      case ClusterProviderEnum.GENERIC:
        return {
          provider: ClusterProviderEnum.GENERIC,
          clientCertificate: config.clientCertificate,
          host: config.host
        }
      default:
        return null
    }
  }

  private buildVirtualServices(
    appName: string,
    appNamespace: string,
    circles: IPipelineCircle[],
    hosts: string[],
    versions: IOctopipeVersion[]
  ): IBaseVirtualService | IEmptyVirtualService {

    return versions.length === 0
      ? createEmptyVirtualService(appName, appNamespace)
      : createVirtualService(appName, appNamespace, circles, hosts)
  }
}
