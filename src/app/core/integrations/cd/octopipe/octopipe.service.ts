import {
  HttpService,
  Inject,
  Injectable
} from '@nestjs/common'
import { IPipelineCircle } from '../../../../api/components/interfaces'
import { IOctopipeConfigurationData } from '../../../../api/configurations/interfaces'
import { IoCTokensConstants } from '../../../constants/ioc'
import { ConsoleLoggerService } from '../../../logs/console'
import {
  IBaseVirtualService,
  IEmptyVirtualService
} from '../spinnaker/connector/interfaces'
import createDestinationRules from '../spinnaker/connector/utils/manifests/base-destination-rules'
import {
  createEmptyVirtualService,
  createVirtualService
} from '../spinnaker/connector/utils/manifests/base-virtual-service'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import { AxiosResponse } from 'axios'
import {
  ICdServiceStrategy,
  IConnectorConfiguration
} from '../interfaces'

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
export class OctopipeService implements ICdServiceStrategy {

  constructor(
    private readonly httpService: HttpService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) { }

  public async createDeployment(configuration: IConnectorConfiguration): Promise<void> {

    const payload: IOctopipeConfiguration = this.createPipelineConfigurationObject(configuration)
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

  public createPipelineConfigurationObject(configuration: IConnectorConfiguration): IOctopipeConfiguration {

    const payload = {
      appName: configuration.componentName,
      appNamespace: (configuration.cdConfiguration as IOctopipeConfigurationData).namespace,
      github: {
        username: (configuration.cdConfiguration as IOctopipeConfigurationData).gitUsername,
        password: (configuration.cdConfiguration as IOctopipeConfigurationData).gitPassword
      },
      helmUrl: configuration.helmRepository,
      istio: { virtualService: {}, destinationRules: {} },
      unusedVersions: configuration.pipelineCirclesOptions.pipelineUnusedVersions,
      versions: this.concatAppNameAndVersion(configuration.pipelineCirclesOptions.pipelineVersions, configuration.componentName),
      webHookUrl: configuration.pipelineCallbackUrl
    }

    payload.istio.virtualService = this.buildVirtualServices(
      configuration.componentName,
      (configuration.cdConfiguration as IOctopipeConfigurationData).namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      [configuration.componentName],
      configuration.pipelineCirclesOptions.pipelineVersions
    )

    payload.istio.destinationRules = createDestinationRules(
      configuration.componentName,
      (configuration.cdConfiguration as IOctopipeConfigurationData).namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      configuration.pipelineCirclesOptions.pipelineVersions
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
