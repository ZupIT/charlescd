import { Injectable } from '@nestjs/common'
import { CdConfiguration, Component, ConnectorResult, Deployment, SpinnakerPipeline } from './interfaces'
import { ICreateSpinnakerApplication } from '../../../../v1/core/integrations/cd/spinnaker/interfaces'
import { SpinnakerApiService } from '../../../../v1/core/integrations/cd/spinnaker/spinnaker-api.service'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { ISpinnakerConfigurationData } from '../../../../v1/api/configurations/interfaces'
import { AppConstants } from '../../../../v1/core/constants'
import { SpinnakerPipelineBuilder } from './pipeline-builder'

@Injectable()
export class SpinnakerConnector {

  constructor(
    private spinnakerApiService: SpinnakerApiService,
    private consoleLoggerService: ConsoleLoggerService
  ) {}

  public async createDeployment(deployment: Deployment, activeComponents: Component[]): Promise<ConnectorResult> {
    this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_DELOYMENT', { deployment, activeComponents })

    try {
      await this.createSpinnakerApplication(deployment.cdConfiguration)
    } catch (error) {
      this.consoleLoggerService.log('ERROR CREATE APPLICATION', { error })
    }

    try {
      await this.createSpinnakerPipeline(deployment, activeComponents)
    } catch (error) {
      this.consoleLoggerService.log('ERROR CREATE PIPELINE', { error })
    }

    try {
      await this.deploySpinnakerPipeline(deployment)
    } catch (error) {
      this.consoleLoggerService.log('ERROR DEPLOY PIPELINE', { error })
    }

    this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_DELOYMENT')
    return { status: 'SUCCEEDED' }
    // this.consoleLoggerService.log('ERROR:CREATE_V2_SPINNAKER_DELOYMENT', { error })
    // throw error // TODO
  }

  private async createSpinnakerApplication(cdConfiguration: CdConfiguration): Promise<void> {
    const applicationName: string = cdConfiguration.id
    const spinnakerUrl: string = (cdConfiguration.configurationData as ISpinnakerConfigurationData).url

    try {
      this.consoleLoggerService.log('START:GET_V2_SPINNAKER_APPLICATION', { applicationName })
      const apiReturn1 = await this.spinnakerApiService.getApplication(applicationName, spinnakerUrl).toPromise()
      this.consoleLoggerService.log('GET_APPLICATION_RETURN', { apiReturn1 })
    } catch (error) {
      this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_APPLICATION')
      const spinnakerApplication: ICreateSpinnakerApplication = this.getSpinnakerApplicationObject(applicationName)
      const apiReturn = await this.spinnakerApiService.createApplication(spinnakerApplication, spinnakerUrl).toPromise()
      this.consoleLoggerService.log('CREATE_APPLICATION_RETURN', { apiReturn })
      this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_APPLICATION')
    }
  }

  private async createSpinnakerPipeline(deployment: Deployment, activeComponents: Component[]): Promise<void> {
    this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_PIPELINE', { deployment })
    const spinnakerPipeline: SpinnakerPipeline = new SpinnakerPipelineBuilder().buildSpinnakerDeploymentPipeline(deployment, activeComponents)
    this.consoleLoggerService.log('GET:SPINNAKER_V2_PIPELINE', { spinnakerPipeline })

    const spinnakerUrl: string = (deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).url
    const { data: { id: pipelineId } } = await this.spinnakerApiService.getPipeline(
      spinnakerPipeline.application, spinnakerPipeline.name, spinnakerUrl
    ).toPromise()

    pipelineId ?
      await this.updateSpinnakerPipeline(pipelineId, spinnakerUrl, spinnakerPipeline) :
      await this.spinnakerApiService.createPipeline(spinnakerPipeline, spinnakerUrl).toPromise()

    this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_PIPELINE')
  }

  private async updateSpinnakerPipeline(pipelineId: string, spinnakerUrl: string, spinnakerPipeline: SpinnakerPipeline): Promise<void> {
    this.consoleLoggerService.log('START:UPDATE_V2_SPINNAKER_PIPELINE', { pipelineId })
    const updateSpinnakerPipeline =  { id: pipelineId, ...spinnakerPipeline }
    await this.spinnakerApiService.updatePipeline(updateSpinnakerPipeline, spinnakerUrl).toPromise()
    this.consoleLoggerService.log('FINISH:UPDATE_V2_SPINNAKER_PIPELINE')
  }

  private async deploySpinnakerPipeline(deployment: Deployment): Promise<void> {
    this.consoleLoggerService.log('START:DEPLOY_V2_SPINNAKER_PIPELINE')
    const spinnakerUrl: string = (deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).url
    await this.spinnakerApiService.deployPipeline(`app-${deployment.cdConfiguration.id}`, deployment.id, spinnakerUrl).toPromise()
    this.consoleLoggerService.log('FINISH:DEPLOY_V2_SPINNAKER_PIPELINE')
  }

  private getSpinnakerApplicationObject(applicationName: string): ICreateSpinnakerApplication {
    return {
      job: [{
        type: AppConstants.SPINNAKER_CREATE_APPLICATION_JOB_TYPE,
        application: {
          cloudProviders: AppConstants.SPINNAKER_CREATE_APPLICATION_DEFAULT_CLOUD,
          instancePort: AppConstants.SPINNAKER_CREATE_APPLICATION_PORT,
          name: `app-${applicationName}`,
          email: AppConstants.SPINNAKER_CREATE_APPLICATION_DEFAULT_EMAIL
        }
      }],
      application: `app-${applicationName}`
    }
  }
}