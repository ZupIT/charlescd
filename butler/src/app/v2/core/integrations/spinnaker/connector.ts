import { Injectable } from '@nestjs/common'
import { ConnectorResult, SpinnakerPipeline } from './interfaces'
import { ICreateSpinnakerApplication } from '../../../../v1/core/integrations/cd/spinnaker/interfaces'
import { SpinnakerApiService } from '../../../../v1/core/integrations/cd/spinnaker/spinnaker-api.service'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { ISpinnakerConfigurationData } from '../../../../v1/api/configurations/interfaces'
import { AppConstants } from '../../../../v1/core/constants'
import { SpinnakerPipelineBuilder } from './pipeline-builder'
import { ConnectorResultError } from './interfaces'
import { CdConfiguration, Component, Deployment } from '../../../api/deployments/interfaces'

export interface ConnectorConfiguration {
    incomingCircleId: string | null
    executionId: string
}

@Injectable()
export class SpinnakerConnector {

  constructor(
    private spinnakerApiService: SpinnakerApiService,
    private consoleLoggerService: ConsoleLoggerService
  ) {}

  public async createDeployment(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<ConnectorResult | ConnectorResultError> {

    try {
      this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_DEPLOYMENT', { deployment, activeComponents })
      await this.createSpinnakerApplication(deployment.cdConfiguration)
      await this.createSpinnakerDeploymentPipeline(deployment, activeComponents, configuration)
      await this.deploySpinnakerPipeline(deployment)
      this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_DEPLOYMENT')
      return { status: 'SUCCEEDED' }
    } catch (error) {
      this.consoleLoggerService.log('ERROR:CREATE_V2_SPINNAKER_DEPLOYMENT', { error })
      return { status: 'ERROR', error: error }
    }
  }

  public async createUndeployment(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<ConnectorResult | ConnectorResultError> {

    try {
      this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_UNDEPLOYMENT', { deployment, activeComponents })
      await this.createSpinnakerApplication(deployment.cdConfiguration)
      await this.createSpinnakerUndeploymentPipeline(deployment, activeComponents, configuration)
      await this.deploySpinnakerPipeline(deployment)
      this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_UNDEPLOYMENT')
      return { status: 'SUCCEEDED' }
    } catch (error) {
      this.consoleLoggerService.log('ERROR:CREATE_V2_SPINNAKER_UNDEPLOYMENT', { error })
      return { status: 'ERROR', error: error }
    }
  }

  private async createSpinnakerApplication(cdConfiguration: CdConfiguration): Promise<void> {
    const applicationName = `app-${cdConfiguration.id}`
    const spinnakerUrl: string = (cdConfiguration.configurationData as ISpinnakerConfigurationData).url

    try {
      this.consoleLoggerService.log('START:GET_V2_SPINNAKER_APPLICATION', { applicationName, spinnakerUrl })
      await this.spinnakerApiService.getApplication(applicationName, spinnakerUrl).toPromise()
    } catch (error) {
      this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_APPLICATION')
      const spinnakerApplication: ICreateSpinnakerApplication = this.getSpinnakerApplicationObject(applicationName)
      this.consoleLoggerService.log('GET:SPINNAKER_APPLICATION_OBJECT', { spinnakerApplication })
      await this.spinnakerApiService.createApplication(spinnakerApplication, spinnakerUrl).toPromise()
      this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_APPLICATION')
    }
  }

  private async createSpinnakerDeploymentPipeline(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<void> {

    this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_DEPLOYMENT_PIPELINE', { deployment })
    const spinnakerPipeline: SpinnakerPipeline =
      new SpinnakerPipelineBuilder().buildSpinnakerDeploymentPipeline(deployment, activeComponents, configuration)
    this.consoleLoggerService.log('GET:SPINNAKER_V2_DEPLOYMENT_PIPELINE', { spinnakerPipeline })
    await this.verifyAndCreatePipeline(deployment, spinnakerPipeline)
    this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_PIPELINE')
  }

  private async createSpinnakerUndeploymentPipeline(
    deployment: Deployment,
    activeComponents: Component[],
    configuration: ConnectorConfiguration
  ): Promise<void> {

    this.consoleLoggerService.log('START:CREATE_V2_SPINNAKER_UNDEPLOYMENT_PIPELINE', { deployment })
    const spinnakerPipeline: SpinnakerPipeline =
      new SpinnakerPipelineBuilder().buildSpinnakerUndeploymentPipeline(deployment, activeComponents, configuration)
    this.consoleLoggerService.log('GET:SPINNAKER_V2_UNDEPLOYMENT_PIPELINE', { spinnakerPipeline })
    await this.verifyAndCreatePipeline(deployment, spinnakerPipeline)
    this.consoleLoggerService.log('FINISH:CREATE_V2_SPINNAKER_UNDEPLOYMENT_PIPELINE')
  }

  private async verifyAndCreatePipeline(deployment: Deployment, spinnakerPipeline: SpinnakerPipeline): Promise<void> {
    const spinnakerUrl: string = (deployment.cdConfiguration.configurationData as ISpinnakerConfigurationData).url
    const { data: { id: pipelineId } } = await this.spinnakerApiService.getPipeline(
      spinnakerPipeline.application, spinnakerPipeline.name, spinnakerUrl
    ).toPromise()

    pipelineId ?
      await this.updateSpinnakerPipeline(pipelineId, spinnakerUrl, spinnakerPipeline) :
      await this.spinnakerApiService.createPipeline(spinnakerPipeline, spinnakerUrl).toPromise()
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
          name: applicationName,
          email: AppConstants.SPINNAKER_CREATE_APPLICATION_DEFAULT_EMAIL
        }
      }],
      application: applicationName
    }
  }
}
