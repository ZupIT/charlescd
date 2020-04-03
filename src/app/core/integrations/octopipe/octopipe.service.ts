import {
  HttpService,
  Inject,
  Injectable
} from '@nestjs/common'
import {
  IPipelineCircle,
  IPipelineOptions
} from '../../../api/components/interfaces'
import {
  ICdConfigurationData,
  IOctopipeConfigurationData
} from '../../../api/configurations/interfaces'
import { ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { IoCTokensConstants } from '../../constants/ioc'
import { ConsoleLoggerService } from '../../logs/console'
import {
  IBaseVirtualService,
  IEmptyVirtualService
} from '../cd/spinnaker/connector/interfaces'
import createDestinationRules from '../cd/spinnaker/connector/utils/manifests/base-destination-rules'
import {
  createEmptyVirtualService,
  createVirtualService
} from '../cd/spinnaker/connector/utils/manifests/base-virtual-service'
import IEnvConfiguration from '../configuration/interfaces/env-configuration.interface'
import { AxiosResponse } from 'axios'

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
  github: {
    username?: string,
    password?: string,
    token?: string
  },
  helmUrl: string
}

@Injectable()
export class OctopipeService {

  constructor(
    private readonly httpService: HttpService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) { }

  // pipelineCirclesOptions: IPipelineOptions
  // configurationData: ICdConfigurationData
  // helmRepository: string
  // componentName: string
  // callbackCircleId: string
  // pipelineCallbackUrl: string

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    configurationData: ICdConfigurationData,
    componentDeployment: ComponentDeploymentEntity,
    circleId: string,
    pipelineCallbackUrl: string
  ): Promise<void> {

    const payload: IOctopipeConfiguration =
      this.createPipelineConfigurationObject(
        pipelineCirclesOptions,
        configurationData as IOctopipeConfigurationData,
        pipelineCallbackUrl,
        componentDeployment.moduleDeployment.helmRepository,
        componentDeployment.componentName
      )

    await this.deploy(payload)
  }

  public async deploy(
    payload: IOctopipeConfiguration
  ): Promise<AxiosResponse<any> | { error: any }> {

    try {
      this.consoleLoggerService.log(`START:DEPLOY_OCTOPIPE_PIPELINE`)
      const octopipeResponse = await this.httpService.post(
        `${this.envConfiguration.octopipeUrl}`,
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
      throw error
    }
  }

  public createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IOctopipeConfigurationData,
    pipelineCallbackUrl: string,
    helmRepositoryUrl: string,
    appName: string
  ): IOctopipeConfiguration {

    const payload = {
      appName,
      appNamespace: deploymentConfiguration.namespace,
      github: {
        username: deploymentConfiguration.gitUsername,
        password: deploymentConfiguration.gitPassword
      },
      helmUrl: helmRepositoryUrl,
      istio: { virtualService: {}, destinationRules: {} },
      unusedVersions: pipelineCirclesOptions.pipelineUnusedVersions,
      versions: this.concatAppNameAndVersion(pipelineCirclesOptions.pipelineVersions, appName),
      webHookUrl: pipelineCallbackUrl
    }

    payload.istio.virtualService = this.buildVirtualServices(
      appName,
      deploymentConfiguration.namespace,
      pipelineCirclesOptions.pipelineCircles,
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

  private concatAppNameAndVersion(versions: IOctopipeVersion[], appName: string): IOctopipeVersion[] {
    return versions.map(version => {
      return Object.assign({}, version, { version: `${appName}-${version.version }`})
    })
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
