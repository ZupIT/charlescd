import { HttpService, Inject, Injectable } from '@nestjs/common'
import { IPipelineCircle, IPipelineOptions, IPipelineVersion } from '../../../api/components/interfaces'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { AppConstants } from '../../constants'
import { IDeploymentConfiguration } from '../configuration/interfaces'
import { ICreateSpinnakerApplication, ISpinnakerPipelineConfiguration } from './interfaces'
import { DeploymentStatusEnum } from '../../../api/deployments/enums'
import { DeploymentsStatusManagementService } from '../../services/deployments-status-management-service'
import { ConsoleLoggerService } from '../../logs/console'
import TotalPipeline from 'typescript-lib-spinnaker'
import { IConsulKV } from '../consul/interfaces'

@Injectable()
export class SpinnakerService {

  constructor(
    private readonly httpService: HttpService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly consoleLoggerService: ConsoleLoggerService,
    @Inject(AppConstants.CONSUL_PROVIDER)
    private readonly consulConfiguration: IConsulKV
  ) { }

  private checkVersionUsage(
    pipelineVersion: IPipelineVersion,
    pipelineCircles: IPipelineCircle[]
  ): boolean {

    return !!pipelineCircles.find(pipelineCircle =>
      pipelineCircle.destination.version === pipelineVersion.version
    )
  }

  private updateRequestedVersion(
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineVersions = pipelineOptions.pipelineVersions.filter(
      pipelineVersion => pipelineVersion.version !== componentDeployment.buildImageTag
    )
    pipelineOptions.pipelineVersions.push(
      this.getNewPipelineVersionObject(componentDeployment)
    )
  }

  private removeUnusedPipelineVersions(
    pipelineOptions: IPipelineOptions
  ): void {

    const currentVersions = pipelineOptions.pipelineVersions.filter(
      pipelineVersion => this.checkVersionUsage(pipelineVersion, pipelineOptions.pipelineCircles)
    )

    const unusedVersions = pipelineOptions.pipelineVersions.filter(v => !currentVersions.includes(v))

    pipelineOptions.pipelineVersions = currentVersions
    pipelineOptions.pipelineUnusedVersions = unusedVersions

  }

  private updatePipelineVersions(
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion[] {

    this.removeUnusedPipelineVersions(pipelineOptions)
    this.updateRequestedVersion(pipelineOptions, componentDeployment)
    return pipelineOptions.pipelineVersions
  }

  private removeCircleFromPipeline(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles = pipelineOptions.pipelineCircles.filter(pipelineCircle => {
      return !pipelineCircle.header || pipelineCircle.header.headerValue !== circle.headerValue
    })
  }

  private removeRequestedHeaderlessCircles(
    pipelineOptions: IPipelineOptions
  ): void {

    pipelineOptions.pipelineCircles = pipelineOptions.pipelineCircles.filter(pipelineCircle => {
      return !!pipelineCircle.header
    })
  }

  private removeRequestedRoutedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity
  ): void {

    if (circle.removeCircle) {
      this.removeCircleFromPipeline(pipelineOptions, circle)
    }
  }

  private removeRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    defaultCircle: boolean
  ): void {

    defaultCircle ?
      this.removeRequestedHeaderlessCircles(pipelineOptions) :
      this.removeRequestedRoutedCircles(pipelineOptions, circle)
  }

  private addRoutedCircleToPipeline(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles.unshift(
      this.getNewPipelineRoutedCircleObject(circle, componentDeployment)
    )
  }

  private updatePipelineCircle(
    circle: CircleDeploymentEntity,
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    this.removeCircleFromPipeline(pipelineOptions, circle)
    this.addRoutedCircleToPipeline(pipelineOptions, circle, componentDeployment)
  }

  private updateRequestedHeaderlessCircles(
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles.push(
      this.getPipelineHeaderlessCircleObject(componentDeployment)
    )
  }

  private updateRequestedRoutedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    if (!circle.removeCircle) {
      this.updatePipelineCircle(circle, pipelineOptions, componentDeployment)
    }
  }

  private updateRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): void {

    defaultCircle ?
      this.updateRequestedHeaderlessCircles(pipelineOptions, componentDeployment) :
      this.updateRequestedRoutedCircles(pipelineOptions, circle, componentDeployment)
  }

  private updatePipelineCircles(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineCircle[] {

    this.removeRequestedCircles(pipelineOptions, circle, defaultCircle)
    this.updateRequestedCircles(pipelineOptions, circle, componentDeployment, defaultCircle)
    return pipelineOptions.pipelineCircles
  }

  public updatePipelineOptions(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineOptions {

    this.updatePipelineCircles(
      pipelineOptions, circle, componentDeployment, defaultCircle
    )

    this.updatePipelineVersions(
      pipelineOptions, componentDeployment
    )

    return pipelineOptions
  }

  private getNewPipelineVersionObject(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion {

    return {
      versionUrl: componentDeployment.buildImageUrl,
      version: componentDeployment.buildImageTag
    }
  }

  private getNewPipelineVersions(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion[] {

    return [
      this.getNewPipelineVersionObject(componentDeployment)
    ]
  }

  private getNewPipelineRoutedCircleObject(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle {

    return {
      header: {
        headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME,
        headerValue: circle.headerValue
      },
      destination: {
        version: componentDeployment.buildImageTag
      }
    }
  }

  private getPipelineHeaderlessCircleObject(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle {

    return {
      destination: {
        version: componentDeployment.buildImageTag
      }
    }
  }

  private getNewPipelineHeaderlessCircles(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return [
      this.getPipelineHeaderlessCircleObject(componentDeployment)
    ]
  }

  private getPipelineRoutedCircles(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return !circle.removeCircle ?
      [this.getNewPipelineRoutedCircleObject(circle, componentDeployment)] :
      []
  }

  private getNewPipelineCircles(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineCircle[] {

    return defaultCircle ?
      this.getNewPipelineHeaderlessCircles(componentDeployment) :
      this.getPipelineRoutedCircles(circle, componentDeployment)
  }

  public createNewPipelineOptions(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineOptions {

    return {
      pipelineCircles: this.getNewPipelineCircles(circle, componentDeployment, defaultCircle),
      pipelineVersions: this.getNewPipelineVersions(componentDeployment),
      pipelineUnusedVersions: []
    }
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

  private getSpinnakerCallbackUrl(componentDeploymentId: string): string {
    return `${this.consulConfiguration.darwinNotificationUrl}?componentDeploymentId=${componentDeploymentId}`
  }

  private createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string,
    circleId: string
  ): ISpinnakerPipelineConfiguration {

    return {
      ...deploymentConfiguration,
      webhookUri: this.getSpinnakerCallbackUrl(componentDeploymentId),
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

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string,
    deploymentId: string,
    circleId: string
  ): Promise<void> {

    this.consoleLoggerService.log(
      'START:CREATE_SPINNAKER_PIPELINE',
      { pipelineCirclesOptions, deploymentConfiguration, componentDeploymentId, deploymentId }
    )

    const spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration =
      this.createPipelineConfigurationObject(
        pipelineCirclesOptions, deploymentConfiguration, componentDeploymentId, circleId
      )

    await this.processSpinnakerApplication(deploymentConfiguration)
    await this.processSpinnakerPipeline(spinnakerPipelineConfiguration, deploymentConfiguration)

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE', spinnakerPipelineConfiguration)

    this.deploySpinnakerPipeline(spinnakerPipelineConfiguration.pipelineName)
      .catch(() => this.setDeploymentStatusAsFailed(deploymentId))
  }
}
