import { Inject, Injectable } from '@nestjs/common'
import { of, throwError, Observable } from 'rxjs'
import { concatMap, delay, map, retryWhen, tap } from 'rxjs/operators'
import { ISpinnakerConfigurationData } from '../../../../api/configurations/interfaces'
import { AppConstants } from '../../../constants'
import { ConsoleLoggerService } from '../../../logs/console'
import { ICdServiceStrategy, IConnectorConfiguration } from '../interfaces'
import TotalPipeline from './connector'
import { IBaseSpinnakerPipeline } from './connector/interfaces'
import { ICreateSpinnakerApplication, ISpinnakerPipelineConfiguration } from './interfaces'
import { SpinnakerApiService } from './spinnaker-api.service'

@Injectable()
export class SpinnakerService implements ICdServiceStrategy {

  private readonly MAXIMUM_RETRY_ATTEMPTS = 5
  private readonly MILLISECONDS_RETRY_DELAY = 1000

  constructor(
    private readonly spinnakerApiService: SpinnakerApiService,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) { }

  public async createDeployment(configuration: IConnectorConfiguration): Promise<void> {

    this.consoleLoggerService.log('START:PROCESS_SPINNAKER_DEPLOYMENT', configuration)
    const spinnakerConfiguration: ISpinnakerPipelineConfiguration = this.getSpinnakerConfiguration(configuration)
    await this.createSpinnakerApplication(spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    await this.createSpinnakerPipeline(spinnakerConfiguration)
    await this.deploySpinnakerPipeline(spinnakerConfiguration.pipelineName, spinnakerConfiguration.applicationName, spinnakerConfiguration.url)
    this.consoleLoggerService.log('FINISH:PROCESS_SPINNAKER_DEPLOYMENT', spinnakerConfiguration)
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
      url: cdConfiguration.url
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

  private getDeployRetryCondition(deployError: Observable<any>) {

    return deployError.pipe(
      concatMap((error, attempts) => {
        return attempts >= this.MAXIMUM_RETRY_ATTEMPTS ?
          throwError('Reached maximum attemps.') :
          this.getDeployRetryPipe(error, attempts)
      })
    )
  }

  private getDeployRetryPipe(error: any, attempts: number) {

    return of(error).pipe(
      tap(() => this.consoleLoggerService.log(`Deploy attempt #${attempts + 1}. Retrying deployment: ${error}`)),
      delay(this.MILLISECONDS_RETRY_DELAY)
    )
  }

  private async createSpinnakerPipeline(spinnakerConfiguration: ISpinnakerPipelineConfiguration): Promise<void> {
    this.consoleLoggerService.log('START:CREATE_SPINNAKER_PIPELINE', { spinnakerConfiguration })
    const spinnakerPipeline: IBaseSpinnakerPipeline = new TotalPipeline(spinnakerConfiguration).buildPipeline()
    const { data: { id: pipelineId } } =
      await this.spinnakerApiService.getPipeline(spinnakerConfiguration.applicationName,
        spinnakerConfiguration.pipelineName, spinnakerConfiguration.url).toPromise()

    pipelineId ?
      await this.updateSpinnakerPipeline(spinnakerConfiguration, pipelineId) :
      await this.spinnakerApiService.createPipeline(spinnakerPipeline, spinnakerConfiguration.url).toPromise()

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE')
  }

  private async updateSpinnakerPipeline(spinnakerConfiguration: ISpinnakerPipelineConfiguration, pipelineId: string): Promise<void> {

    this.consoleLoggerService.log('START:UPDATE_SPINNAKER_PIPELINE', { pipelineId })
    const spinnakerPipeline: IBaseSpinnakerPipeline = new TotalPipeline(spinnakerConfiguration).buildPipeline()
    const updatedSpinnakerPipeline = this.createUpdatePipelineObject(pipelineId, spinnakerConfiguration, spinnakerPipeline)
    await this.spinnakerApiService.updatePipeline(updatedSpinnakerPipeline, spinnakerConfiguration.url).toPromise()
    this.consoleLoggerService.log('FINISH:UPDATE_SPINNAKER_PIPELINE')
  }

  private createUpdatePipelineObject(
    pipelineId: string,
    spinnakerConfiguration: ISpinnakerPipelineConfiguration,
    spinnakerPipeline: IBaseSpinnakerPipeline
  ): IBaseSpinnakerPipeline & { id: string } {

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
