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

import { Injectable } from '@nestjs/common'
import { of, throwError, Observable } from 'rxjs'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import { ISpinnakerConfigurationData } from '../../../../api/configurations/interfaces'
import { AppConstants } from '../../../constants'
import { ConsoleLoggerService } from '../../../logs/console'
import { ICdServiceStrategy, IConnectorConfiguration } from '../interfaces'
import TotalPipeline from './connector'
import { IBaseSpinnakerPipeline, IUpdateSpinnakerPipeline } from './connector/interfaces'
import { ICreateSpinnakerApplication, ISpinnakerPipelineConfiguration } from './interfaces'
import { SpinnakerApiService } from './spinnaker-api.service'
import { PipelineTypeEnum } from './connector/pipelines/enums/pipeline-type.enum'

@Injectable()
export class SpinnakerService implements ICdServiceStrategy {

  constructor(
    private readonly spinnakerApiService: SpinnakerApiService,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async createDeployment(configuration: IConnectorConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:PROCESS_SPINNAKER_DEPLOYMENT', configuration)
    const spinnakerConfiguration: ISpinnakerPipelineConfiguration = this.getSpinnakerConfiguration(configuration)
    await this.createSpinnakerApplication(spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    await this.createSpinnakerPipeline(spinnakerConfiguration, PipelineTypeEnum.DEFAULT)
    await this.deploySpinnakerPipeline(spinnakerConfiguration.pipelineName, spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    this.consoleLoggerService.log('FINISH:PROCESS_SPINNAKER_DEPLOYMENT', spinnakerConfiguration)
  }

  public async createIstioDeployment(configuration: IConnectorConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:PROCESS_SPINNAKER_ISTIO_DEPLOYMENT', configuration)
    const spinnakerConfiguration: ISpinnakerPipelineConfiguration = this.getSpinnakerConfiguration(configuration)
    await this.createSpinnakerApplication(spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    await this.createSpinnakerPipeline(spinnakerConfiguration, PipelineTypeEnum.ISTIO)
    await this.deploySpinnakerPipeline(spinnakerConfiguration.pipelineName, spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    this.consoleLoggerService.log('FINISH:PROCESS_SPINNAKER_ISTIO_DEPLOYMENT', spinnakerConfiguration)
  }

  public async createUndeployment(configuration: IConnectorConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:PROCESS_SPINNAKER_UNDEPLOYMENT', configuration)
    const spinnakerConfiguration: ISpinnakerPipelineConfiguration = this.getSpinnakerConfiguration(configuration)
    await this.createSpinnakerApplication(spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    await this.createSpinnakerPipeline(spinnakerConfiguration, PipelineTypeEnum.UNDEPLOYED)
    await this.deploySpinnakerPipeline(spinnakerConfiguration.pipelineName, spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    this.consoleLoggerService.log('FINISH:PROCESS_SPINNAKER_UNDEPLOYMENT', spinnakerConfiguration)
  }

  private getSpinnakerConfiguration(configuration: IConnectorConfiguration): ISpinnakerPipelineConfiguration {
    const cdConfiguration = configuration.cdConfiguration as ISpinnakerConfigurationData
    return {
      account: cdConfiguration.account,
      appNamespace: cdConfiguration.namespace,
      pipelineName: configuration.componentId,
      applicationName: `${AppConstants.SPINNAKER_APPLICATION_PREFIX}${configuration.applicationName}`,
      appName: configuration.componentName,
      webhookUri: configuration.pipelineCallbackUrl,
      versions: configuration.pipelineCirclesOptions.pipelineVersions,
      unusedVersions: configuration.pipelineCirclesOptions.pipelineUnusedVersions,
      circles: configuration.pipelineCirclesOptions.pipelineCircles,
      githubAccount: cdConfiguration.gitAccount,
      helmRepository: configuration.helmRepository,
      circleId: configuration.callbackCircleId,
      url: cdConfiguration.url,
      callbackType: configuration.callbackType,
      hosts: [configuration.componentName],
      hostValue: configuration.hostValue,
      gatewayName: configuration.gatewayName
    }
  }

  private async deploySpinnakerPipeline(pipelineName: string, applicationName: string, url: string): Promise<void> {

    this.consoleLoggerService.log(`START:DEPLOY_SPINNAKER_PIPELINE ${pipelineName} - APPLICATION ${applicationName} `)
    await this.spinnakerApiService.deployPipeline(applicationName, pipelineName, url)
      .pipe(
        map(response => response),
        retryWhen(error => this.getDeployRetryCondition(error))
      ).toPromise()
    this.consoleLoggerService.log(`FINISH:DEPLOY_SPINNAKER_PIPELINE ${pipelineName}`)
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

  private async createSpinnakerPipeline(spinnakerConfiguration: ISpinnakerPipelineConfiguration, pipelineType: PipelineTypeEnum): Promise<void> {
    this.consoleLoggerService.log('START:CREATE_SPINNAKER_PIPELINE', { spinnakerConfiguration })
    const spinnakerPipeline: IBaseSpinnakerPipeline = this.getTotalPipelineByPipelineType(spinnakerConfiguration, pipelineType)
    this.consoleLoggerService.log('GET:SPINNAKER_TOTAL_PIPELINE', { spinnakerPipeline })

    const { data: { id: pipelineId } } = await this.spinnakerApiService.getPipeline(
      spinnakerConfiguration.applicationName, spinnakerConfiguration.pipelineName, spinnakerConfiguration.url
    ).toPromise()

    pipelineId ?
      await this.updateSpinnakerPipeline(spinnakerConfiguration, pipelineId, pipelineType) :
      await this.spinnakerApiService.createPipeline(spinnakerPipeline, spinnakerConfiguration.url).toPromise()

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE')
  }

  private getTotalPipelineByPipelineType(
    spinnakerConfiguration: ISpinnakerPipelineConfiguration,
    pipelineType: PipelineTypeEnum
  ): IBaseSpinnakerPipeline {
    if (pipelineType === PipelineTypeEnum.ISTIO) {
      return new TotalPipeline(spinnakerConfiguration).buildIstioPipeline()
    }
    if (pipelineType === PipelineTypeEnum.UNDEPLOYED) {
      return new TotalPipeline(spinnakerConfiguration).buildUndeploymentPipeline()
    }
    return new TotalPipeline(spinnakerConfiguration).buildPipeline()
  }

  private async updateSpinnakerPipeline(
    spinnakerConfiguration: ISpinnakerPipelineConfiguration,
    pipelineId: string,
    pipelineType: PipelineTypeEnum,
  ): Promise<void> {

    this.consoleLoggerService.log('START:UPDATE_SPINNAKER_PIPELINE', { pipelineId })
    const spinnakerPipeline: IBaseSpinnakerPipeline = this.getTotalPipelineByPipelineType(spinnakerConfiguration, pipelineType)
    const updatedSpinnakerPipeline = this.createUpdatePipelineObject(pipelineId, spinnakerConfiguration, spinnakerPipeline)
    await this.spinnakerApiService.updatePipeline(updatedSpinnakerPipeline, spinnakerConfiguration.url).toPromise()
    this.consoleLoggerService.log('FINISH:UPDATE_SPINNAKER_PIPELINE')
  }

  private createUpdatePipelineObject(
    pipelineId: string,
    spinnakerConfiguration: ISpinnakerPipelineConfiguration,
    spinnakerPipeline: IBaseSpinnakerPipeline
  ): IUpdateSpinnakerPipeline {

    return {
      ...spinnakerPipeline,
      id: pipelineId,
      application: spinnakerConfiguration.applicationName,
      name: spinnakerConfiguration.pipelineName
    }
  }

  private async createSpinnakerApplication(applicationName: string, url: string): Promise<void> {

    try {
      this.consoleLoggerService.log('START:GET_SPINNAKER_APPLICATION', { applicationName })
      await this.spinnakerApiService.getApplication(applicationName, url).toPromise()
    } catch (error) {
      this.consoleLoggerService.log('START:CREATE_SPINNAKER_APPLICATION')
      const spinnakerApplication: ICreateSpinnakerApplication = this.getCreateSpinnakerApplicationObject(applicationName)
      await this.spinnakerApiService.createApplication(spinnakerApplication, url).toPromise()
      this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_APPLICATION')
    }
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
}
