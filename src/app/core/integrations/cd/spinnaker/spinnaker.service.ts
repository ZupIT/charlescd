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

@Injectable()
export class SpinnakerService {

  private readonly MAXIMUM_RETRY_ATTEMPTS = 5
  private readonly MILLISECONDS_RETRY_DELAY = 1000

  constructor(
    private readonly httpService: HttpService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) {}

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    configurationData: ICdConfigurationData,
    componentDeployment: ComponentDeploymentEntity,
    circleId: string,
    pipelineCallbackUrl: string
  ): Promise<void> {

    this.consoleLoggerService.log(
      'START:CREATE_SPINNAKER_PIPELINE',
      { pipelineCirclesOptions, configurationData }
    )

    const deploymentConfiguration: IDeploymentConfiguration =
        this.getConfigurationObject(configurationData as ISpinnakerConfigurationData, componentDeployment)

    const spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration =
      this.createPipelineConfigurationObject(
        pipelineCirclesOptions, deploymentConfiguration, circleId, pipelineCallbackUrl, componentDeployment.moduleDeployment
      )

    await this.processSpinnakerApplication(deploymentConfiguration)
    await this.processSpinnakerPipeline(spinnakerPipelineConfiguration, deploymentConfiguration)

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE', spinnakerPipelineConfiguration)

    await this.deploySpinnakerPipeline(
        spinnakerPipelineConfiguration.pipelineName,
        spinnakerPipelineConfiguration.applicationName
    )
  }

  public async deploySpinnakerPipeline(
      pipelineName: string,
      application: string
  ): Promise<void> {

    this.consoleLoggerService.log(`START:DEPLOY_SPINNAKER_PIPELINE ${pipelineName} - APPLICATION ${application} `)
    await this.httpService.post(
        `${this.envConfiguration.spinnakerUrl}/pipelines/${application}/${pipelineName}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
    ).pipe(
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

  private getConfigurationObject(
      cdConfigurationData: ISpinnakerConfigurationData,
      componentDeploymentEntity: ComponentDeploymentEntity
  ): IDeploymentConfiguration {

    return {
      account: cdConfigurationData.account,
      appNamespace: cdConfigurationData.namespace,
      pipelineName: componentDeploymentEntity.componentId,
      applicationName: `${AppConstants.SPINNAKER_APPLICATION_PREFIX}${componentDeploymentEntity.moduleDeployment.deployment.applicationName}`,
      appName: componentDeploymentEntity.componentName,
      healthCheckPath: componentDeploymentEntity.healthCheck,
      uri: {
        uriName: componentDeploymentEntity.contextPath
      },
      appPort: componentDeploymentEntity.port
    }
  }

  private createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    circleId: string,
    pipelineCallbackUrl: string,
    moduleDeployment: ModuleDeploymentEntity
  ): ISpinnakerPipelineConfiguration {

    return {
      ...deploymentConfiguration,
      webhookUri: pipelineCallbackUrl,
      versions: pipelineCirclesOptions.pipelineVersions,
      unusedVersions: pipelineCirclesOptions.pipelineUnusedVersions,
      circles: pipelineCirclesOptions.pipelineCircles,
      githubAccount: this.envConfiguration.spinnakerGithubAccount,
      helmRepository: moduleDeployment.helmRepository,
      circleId
    }
  }

  private async getSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration
  ) {

    const spinnakerBuilder = new TotalPipeline(spinnakerPipelineConfiguration)

    return spinnakerBuilder.buildPipeline()
  }

  private async createSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration
  ): Promise<void> {

    try {
      const pipeline = await this.getSpinnakerPipeline(spinnakerPipelineConfiguration)
      await this.httpService.post(
        `${this.envConfiguration.spinnakerUrl}/pipelines`,
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
      `${this.envConfiguration.spinnakerUrl}/pipelines`,
      updatePipelineObject,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()

    this.consoleLoggerService.log('FINISH:UPDATE_SPINNAKER_PIPELINE')
  }

  private async checkPipelineExistence(pipelineName: string, applicationName: string): Promise<string> {
    const { data: { id } } = await this.httpService.get(
      `${this.envConfiguration.spinnakerUrl}/applications/${applicationName}/pipelineConfigs/${pipelineName}`
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
      `${this.envConfiguration.spinnakerUrl}/tasks`,
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
      `${this.envConfiguration.spinnakerUrl}/applications/${applicationName}`,
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
