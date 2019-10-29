import { HttpService, Inject, Injectable } from '@nestjs/common'
import { IPipelineOptions } from '../../../api/components/interfaces'
import { AppConstants } from '../../constants'
import { IDeploymentConfiguration } from '../configuration/interfaces'
import { ICreateSpinnakerApplication, ISpinnakerPipelineConfiguration } from './interfaces'
import { DeploymentStatusEnum } from '../../../api/deployments/enums'
import { StatusManagementService } from '../../../api/deployments/services'
import { ConsoleLoggerService } from '../../logs/console'
import TotalPipeline from 'typescript-lib-spinnaker'
import { IConsulKV } from '../consul/interfaces'

@Injectable()
export class SpinnakerService {

  constructor(
    private readonly httpService: HttpService,
    private readonly deploymentsStatusManagementService: StatusManagementService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(AppConstants.CONSUL_PROVIDER)
    private readonly consulConfiguration: IConsulKV
  ) { }

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string,
    deploymentId: string,
    circleId: string,
    pipelineCallbackUrl: string
  ): Promise<void> {

    this.consoleLoggerService.log(
      'START:CREATE_SPINNAKER_PIPELINE',
      { pipelineCirclesOptions, deploymentConfiguration, componentDeploymentId, deploymentId }
    )

    const spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration =
      this.createPipelineConfigurationObject(
        pipelineCirclesOptions, deploymentConfiguration, circleId, pipelineCallbackUrl
      )

    await this.processSpinnakerApplication(deploymentConfiguration)
    await this.processSpinnakerPipeline(spinnakerPipelineConfiguration, deploymentConfiguration)

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE', spinnakerPipelineConfiguration)

    this.deploySpinnakerPipeline(spinnakerPipelineConfiguration.pipelineName)
      .catch(() => this.setDeploymentStatusAsFailed(deploymentId))
  }

  private async deploySpinnakerPipeline(pipelineName: string): Promise<void> {

    await this.waitForPipelineCreation()
    this.consoleLoggerService.log(`START:DEPLOY_SPINNAKER_PIPELINE ${pipelineName}`)
    await this.httpService.post(
      `${this.consulConfiguration.spinnakerUrl}/webhooks/webhook/${pipelineName}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
    this.consoleLoggerService.log(`FINISH:DEPLOY_SPINNAKER_PIPELINE ${pipelineName}`)
  }

  private createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    circleId: string,
    pipelineCallbackUrl: string
  ): ISpinnakerPipelineConfiguration {

    return {
      ...deploymentConfiguration,
      webhookUri: pipelineCallbackUrl,
      versions: pipelineCirclesOptions.pipelineVersions,
      unusedVersions: pipelineCirclesOptions.pipelineUnusedVersions,
      circles: pipelineCirclesOptions.pipelineCircles,
      circleId
    }
  }

  private async getSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration
  ) {

    const spinnakerBuilder = new TotalPipeline()

    return spinnakerBuilder.buildPipeline(
      spinnakerPipelineConfiguration
    )
  }

  private async waitForPipelineCreation(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 10000)
    })
  }

  private async createSpinnakerPipeline(
    spinnakerPipelineConfiguraton: ISpinnakerPipelineConfiguration
  ): Promise<void> {

    try {
      const pipeline = await this.getSpinnakerPipeline(spinnakerPipelineConfiguraton)
      await this.httpService.post(
        `${this.consulConfiguration.spinnakerUrl}/pipelines`,
        pipeline,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).toPromise()
    } catch (error) {
      throw error
    }
  }

  private createUpdatePipelineObject(
    pipelineId: string, spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration, pipeline
  ) {
    return {
      ...pipeline,
      id: pipelineId,
      application: spinnakerPipelineConfiguration.applicationName,
      name: spinnakerPipelineConfiguration.pipelineName
    }
  }

  private async updateSpinnakerPipeline(
    spinnakerPipelineConfiguraton: ISpinnakerPipelineConfiguration, pipelineId: string
  ): Promise<void> {

    this.consoleLoggerService.log('START:UPDATE_SPINNAKER_PIPELINE')

    const pipeline = await this.getSpinnakerPipeline(spinnakerPipelineConfiguraton)
    const updatePipelineObject =
      this.createUpdatePipelineObject(pipelineId, spinnakerPipelineConfiguraton, pipeline)

    await this.httpService.post(
      `${this.consulConfiguration.spinnakerUrl}/pipelines`,
      updatePipelineObject,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()

    this.consoleLoggerService.log('FINISH:UPDATE_SPINNAKER_PIPELINE')
  }

  private async setDeploymentStatusAsFailed(deploymentId: string): Promise<void> {
    this.consoleLoggerService.error(`ERROR:DEPLOY_SPINNAKER_PIPELINE ${deploymentId}`)
    await this.deploymentsStatusManagementService
      .deepUpdateDeploymentStatusByDeploymentId(deploymentId, DeploymentStatusEnum.FAILED)
  }

  private async checkPipelineExistence(pipelineName: string, applicationName: string): Promise<string> {
    const { data: { id } } = await this.httpService.get(
      `${this.consulConfiguration.spinnakerUrl}/applications/${applicationName}/pipelineConfigs/${pipelineName}`
    ).toPromise()
    return id
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

  private async createSpinnakerApplication(applicationName: string): Promise<void> {
    const createApplicationObject: ICreateSpinnakerApplication =
      this.getCreateSpinnakerApplicationObject(applicationName)
    this.consoleLoggerService.log('START:CREATE_SPINNAKER_APPLICATION', { createApplicationObject })

    await this.httpService.post(
      `${this.consulConfiguration.spinnakerUrl}/applications/${applicationName}/tasks`,
      createApplicationObject,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_APPLICATION')
  }

  private async checkSpinnakerApplicationExistence(applicationName: string): Promise<void> {
    await this.httpService.get(
      `${this.consulConfiguration.spinnakerUrl}/applications/${applicationName}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
  }

  private async processSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration,
    deploymentConfiguration: IDeploymentConfiguration
  ): Promise<void> {

    const pipelineId: string = await this.checkPipelineExistence(
      spinnakerPipelineConfiguration.pipelineName, deploymentConfiguration.applicationName
    )

    pipelineId ?
      await this.updateSpinnakerPipeline(spinnakerPipelineConfiguration, pipelineId) :
      await this.createSpinnakerPipeline(spinnakerPipelineConfiguration)
  }

  private async processSpinnakerApplication(
    deploymentConfiguration: IDeploymentConfiguration
  ): Promise<void> {

    try {
      await this.checkSpinnakerApplicationExistence(deploymentConfiguration.applicationName)
    } catch (error) {
      await this.createSpinnakerApplication(deploymentConfiguration.applicationName)
    }
  }
}
