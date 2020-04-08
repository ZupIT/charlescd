import {
  HttpService,
  Inject,
  Injectable
} from '@nestjs/common'
import { IPipelineOptions } from '../../../../api/components/interfaces'
import {
  ComponentDeploymentEntity,
  ModuleDeploymentEntity
} from '../../../../api/deployments/entity'
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
import {
  concatMap,
  delay,
  map,
  retryWhen,
  tap
} from 'rxjs/operators'
import {
  of,
  throwError
} from 'rxjs'
import {
  ICdServiceStrategy,
  IConnectorConfiguration
} from '../interfaces'
import { application } from 'express'
import { SpinnakerApiService } from './spinnaker-api.service'
import { IBaseSpinnakerPipeline } from './connector/interfaces'
import { create } from 'domain'

@Injectable()
export class SpinnakerService implements ICdServiceStrategy {

  private readonly MAXIMUM_RETRY_ATTEMPTS = 5
  private readonly MILLISECONDS_RETRY_DELAY = 1000

  constructor(
    private readonly spinnakerApiService: SpinnakerApiService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) {}

  public async createDeployment(configuration: IConnectorConfiguration): Promise<void> {

    this.consoleLoggerService.log('START:PROCESS_SPINNAKER_DEPLOYMENT', configuration)
    const spinnakerConfiguration: ISpinnakerPipelineConfiguration = this.getSpinnakerConfiguration(configuration)
    await this.createSpinnakerApplication(spinnakerConfiguration.applicationName)
    await this.createSpinnakerPipeline(spinnakerConfiguration)
    await this.deploySpinnakerPipeline(spinnakerConfiguration.pipelineName, spinnakerConfiguration.applicationName)
    this.consoleLoggerService.log('FINISH:PROCESS_SPINNAKER_DEPLOYMENT', spinnakerConfiguration)
  }

  private getSpinnakerConfiguration(configuration: IConnectorConfiguration): ISpinnakerPipelineConfiguration {

    return {
      account: (configuration.cdConfiguration as ISpinnakerConfigurationData).account,
      appNamespace: (configuration.cdConfiguration as ISpinnakerConfigurationData).namespace,
      pipelineName: configuration.componentId,
      applicationName: `${AppConstants.SPINNAKER_APPLICATION_PREFIX}${configuration.applicationName}`,
      appName: configuration.componentName,
      webhookUri: configuration.pipelineCallbackUrl,
      versions: configuration.pipelineCirclesOptions.pipelineVersions,
      unusedVersions: configuration.pipelineCirclesOptions.pipelineUnusedVersions,
      circles: configuration.pipelineCirclesOptions.pipelineCircles,
      githubAccount: this.envConfiguration.spinnakerGithubAccount,
      helmRepository: configuration.helmRepository,
      circleId: configuration.callbackCircleId
    }
  }

  private async deploySpinnakerPipeline(pipelineName: string, applicationName: string): Promise<void> {

    this.consoleLoggerService.log(`START:DEPLOY_SPINNAKER_PIPELINE ${pipelineName} - APPLICATION ${applicationName} `)
    await this.spinnakerApiService.deployPipeline(applicationName, pipelineName)
        .pipe(
          map(response => response),
          retryWhen(error => this.getDeployRetryCondition(error))
        ).toPromise()
    this.consoleLoggerService.log(`FINISH:DEPLOY_SPINNAKER_PIPELINE ${pipelineName}`)
  }

  private getDeployRetryCondition(deployError) {

    return deployError.pipe(
        concatMap((error, attempts) => {
          return attempts >= this.MAXIMUM_RETRY_ATTEMPTS ?
              throwError('Reached maximum attemps.') :
              this.getDeployRetryPipe(error, attempts)
        })
    )
  }

  private getDeployRetryPipe(error, attempts: number) {

    return of(error).pipe(
        tap(() => this.consoleLoggerService.log(`Deploy attempt #${attempts + 1}. Retrying deployment: ${error}`)),
        delay(this.MILLISECONDS_RETRY_DELAY)
    )
  }

  private async createSpinnakerPipeline(spinnakerConfiguration: ISpinnakerPipelineConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:CREATE_SPINNAKER_PIPELINE', { spinnakerConfiguration })
    const spinnakerPipeline: IBaseSpinnakerPipeline = new TotalPipeline(spinnakerConfiguration).buildPipeline()
    const { data: { id: pipelineId }} =
        await this.spinnakerApiService.getPipeline(spinnakerConfiguration.applicationName, spinnakerConfiguration.pipelineName).toPromise()

    pipelineId ?
        await this.updateSpinnakerPipeline(spinnakerConfiguration, pipelineId) :
        await this.spinnakerApiService.createPipeline(spinnakerPipeline).toPromise()

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE')
  }

  private async updateSpinnakerPipeline(spinnakerConfiguration: ISpinnakerPipelineConfiguration, pipelineId: string): Promise<void> {

    this.consoleLoggerService.log('START:UPDATE_SPINNAKER_PIPELINE', { pipelineId })
    const spinnakerPipeline: IBaseSpinnakerPipeline = new TotalPipeline(spinnakerConfiguration).buildPipeline()
    const updatedSpinnakerPipeline = this.createUpdatePipelineObject(pipelineId, spinnakerConfiguration, spinnakerPipeline)
    await this.spinnakerApiService.updatePipeline(updatedSpinnakerPipeline).toPromise()
    this.consoleLoggerService.log('FINISH:UPDATE_SPINNAKER_PIPELINE')
  }

  private createUpdatePipelineObject(
      pipelineId: string,
      spinnakerConfiguration: ISpinnakerPipelineConfiguration,
      spinnakerPipeline: IBaseSpinnakerPipeline
  ) {

    return {
      ...spinnakerPipeline,
      id: pipelineId,
      application: spinnakerConfiguration.applicationName,
      name: spinnakerConfiguration.pipelineName
    }
  }

  private async createSpinnakerApplication(applicationName: string): Promise<void> {

    try {
      this.consoleLoggerService.log('START:GET_SPINNAKER_APPLICATION', { applicationName })
      await this.spinnakerApiService.getApplication(applicationName).toPromise()
    } catch (error) {
      this.consoleLoggerService.log('START:CREATE_SPINNAKER_APPLICATION')
      const spinnakerApplication: ICreateSpinnakerApplication = this.getCreateSpinnakerApplicationObject(applicationName)
      await this.spinnakerApiService.createApplication(spinnakerApplication).toPromise()
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
