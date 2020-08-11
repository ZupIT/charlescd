/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Inject, Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { IPipelineCircle } from '../../../../api/components/interfaces'
import { OctopipeConfigurationData } from '../../../../api/configurations/interfaces'
import { IoCTokensConstants } from '../../../constants/ioc'
import { ConsoleLoggerService } from '../../../logs/console'
import IEnvConfiguration from '../../configuration/interfaces/env-configuration.interface'
import {
  ClusterProviderEnum, IGenericClusterConfig, IEKSClusterConfig, IOctopipePayload, IOctopipeVersion
} from '../../octopipe/interfaces/octopipe-payload.interface'
import { ICdServiceStrategy, IConnectorConfiguration } from '../interfaces'
import { IBaseVirtualService, IEmptyVirtualService } from '../spinnaker/connector/interfaces'
import createDestinationRules from '../spinnaker/connector/utils/manifests/base-destination-rules'
import { createEmptyVirtualService, createVirtualService } from '../spinnaker/connector/utils/manifests/base-virtual-service'
import { OctopipeApiService } from './octopipe-api.service'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import { Observable, of, throwError } from 'rxjs'
import { AppConstants } from '../../../constants'

@Injectable()
export class OctopipeService implements ICdServiceStrategy {

  constructor(
    private readonly octopipeApiService: OctopipeApiService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) { }

  public async createDeployment(configuration: IConnectorConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:CREATE_OCTOPIPE_DEPLOYMENT', { configuration })
    const payload: IOctopipePayload = this.createPipelineConfigurationObject(configuration)
    this.consoleLoggerService.log('GET:OCTOPIPE_PAYLOAD', { payload })
    await this.deploy(payload)
    this.consoleLoggerService.log('START:FINISH_OCTOPIPE_DEPLOYMENT')
  }

  public async createIstioDeployment(configuration: IConnectorConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:CREATE_OCTOPIPE_ISTIO_DEPLOYMENT', { configuration })
    const payload: IOctopipePayload = this.createIstioPipelineConfigurationObject(configuration)
    this.consoleLoggerService.log('GET:OCTOPIPE_PAYLOAD', { payload })
    await this.deploy(payload)
    this.consoleLoggerService.log('START:FINISH_OCTOPIPE_ISTIO_DEPLOYMENT')
  }

  public async createUndeployment(configuration: IConnectorConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:CREATE_OCTOPIPE_UNDEPLOYMENT', { configuration })
    const payload: IOctopipePayload = this.createUndeployPipelineConfigurationObject(configuration)
    this.consoleLoggerService.log('GET:OCTOPIPE_PAYLOAD', { payload })
    await this.deploy(payload)
    this.consoleLoggerService.log('START:FINISH_OCTOPIPE_UNDEPLOYMENT')
  }

  public async deploy(
    octopipeConfiguration: IOctopipePayload
  ): Promise<AxiosResponse> {

    try {
      this.consoleLoggerService.log('START:DEPLOY_OCTOPIPE_PIPELINE')
      return await this.octopipeApiService.deploy(octopipeConfiguration)
        .pipe(
          map(response => response),
          retryWhen(error => this.getDeployRetryCondition(error))
        ).toPromise()
    } catch (error) {
      this.consoleLoggerService.error('ERROR:DEPLOY_OCTOPIPE_PIPELINE', error)
      throw error
    } finally {
      this.consoleLoggerService.log('FINISH:DEPLOY_OCTOPIPE_PIPELINE')
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getDeployRetryCondition(deployError: Observable<any>) {
    return deployError.pipe(
      concatMap((error, attempts) => {
        return attempts >= AppConstants.CD_CONNECTION_MAXIMUM_RETRY_ATTEMPTS ?
          throwError('Reached maximum attemps.') :
          this.getDeployRetryPipe(error, attempts)
      })
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getDeployRetryPipe(error: any, attempts: number) {
    return of(error).pipe(
      tap(() => this.consoleLoggerService.log(`Deploy attempt #${attempts + 1}. Retrying deployment: ${error}`)),
      delay(AppConstants.CD_CONNECTION_MILLISECONDS_RETRY_DELAY)
    )
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
      unusedVersions: [{}],
      versions: this.concatAppNameAndVersion(configuration.pipelineCirclesOptions.pipelineVersions, configuration.componentName),
      webHookUrl: configuration.pipelineCallbackUrl,
      circleId: configuration.callbackCircleId,
      callbackType:  configuration.callbackType
    }
    payload = this.addK8sConfig(payload, deploymentConfiguration)
    return payload
  }

  public createIstioPipelineConfigurationObject(configuration: IConnectorConfiguration): IOctopipePayload {
    const deploymentConfiguration: OctopipeConfigurationData = configuration.cdConfiguration as OctopipeConfigurationData
    let payload = {
      appName: configuration.componentName,
      appNamespace: deploymentConfiguration.namespace,
      git: {
        provider: deploymentConfiguration.gitProvider,
        token: deploymentConfiguration.gitToken
      },
      unusedVersions: this.concatAppNameAndVersion(configuration.pipelineCirclesOptions.pipelineUnusedVersions, configuration.componentName),
      versions: [{}],
      helmUrl: configuration.helmRepository,
      istio: { virtualService: {}, destinationRules: {} },
      webHookUrl: configuration.pipelineCallbackUrl,
      circleId: configuration.callbackCircleId,
      callbackType:  configuration.callbackType
    }
    payload = this.addK8sConfig(payload, deploymentConfiguration)

    payload.istio.virtualService = this.buildVirtualServices(
      configuration.componentName,
      deploymentConfiguration.namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      [configuration.componentName],
      configuration.pipelineCirclesOptions.pipelineVersions,
      configuration.hostValue,
      configuration.gatewayName,
    )

    payload.istio.destinationRules = createDestinationRules(
      configuration.componentName,
      deploymentConfiguration.namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      configuration.pipelineCirclesOptions.pipelineVersions,
      configuration.hostValue
    )

    return payload
  }

  public createUndeployPipelineConfigurationObject(configuration: IConnectorConfiguration): IOctopipePayload {
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
      unusedVersions: this.concatAppNameAndVersion(configuration.pipelineCirclesOptions.pipelineUnusedVersions, configuration.componentName),
      versions: this.concatAppNameAndVersion(configuration.pipelineCirclesOptions.pipelineVersions, configuration.componentName),
      webHookUrl: configuration.pipelineCallbackUrl,
      circleId: configuration.callbackCircleId,
      callbackType:  configuration.callbackType
    }
    payload = this.addK8sConfig(payload, deploymentConfiguration)

    payload.istio.virtualService = this.buildVirtualServices(
      configuration.componentName,
      deploymentConfiguration.namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      [configuration.componentName],
      configuration.pipelineCirclesOptions.pipelineVersions,
      configuration.hostValue,
      configuration.gatewayName,
    )

    payload.istio.destinationRules = createDestinationRules(
      configuration.componentName,
      deploymentConfiguration.namespace,
      configuration.pipelineCirclesOptions.pipelineCircles,
      configuration.pipelineCirclesOptions.pipelineVersions,
      configuration.hostValue
    )
    return payload
  }

  private concatAppNameAndVersion(versions: IOctopipeVersion[], appName: string): IOctopipeVersion[] {
    return versions.map(version => {
      return Object.assign({}, version, { version: `${appName}-${version.version}` })
    })
  }

  private addK8sConfig(payload: IOctopipePayload, deploymentConfiguration: OctopipeConfigurationData): IOctopipePayload {
    if (deploymentConfiguration.provider === ClusterProviderEnum.DEFAULT) {
      return payload
    }
    const k8sConfig = this.buildK8sConfig(deploymentConfiguration)
    payload.k8s = k8sConfig
    return payload
  }

  private buildK8sConfig(config: OctopipeConfigurationData): IEKSClusterConfig | IGenericClusterConfig | null {
    switch (config.provider) {
    case ClusterProviderEnum.EKS:
      return {
        provider: ClusterProviderEnum.EKS,
        awsSID: config.awsSID,
        awsSecret: config.awsSecret,
        awsRegion: config.awsRegion,
        awsClusterName: config.awsClusterName
      }
    case ClusterProviderEnum.GENERIC:
      return {
        provider: ClusterProviderEnum.GENERIC,
        clientCertificate: config.clientCertificate,
        caData: config.caData,
        clientKey: config.clientKey,
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
    versions: IOctopipeVersion[],
    hostValue: string | undefined,
    gatewayName: string | undefined
  ): IBaseVirtualService | IEmptyVirtualService {

    return versions.length === 0
      ? createEmptyVirtualService(appName, appNamespace)
      : createVirtualService(appName, appNamespace, circles, hosts, hostValue, gatewayName)
  }
}
