import { HttpService, Injectable } from '@nestjs/common'
import { createSpinnakerPipeline } from 'lib-spinnaker'
import { IPipelineCircle, IPipelineOptions, IPipelineVersion } from '../../../api/components/interfaces'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { AppConstants } from '../../constants'
import { IDeploymentConfiguration } from '../configuration/interfaces'
import { ISpinnakerPipelineConfiguration } from './interfaces'
import { DeploymentStatusEnum } from '../../../api/deployments/enums'
import { DeploymentsStatusManagementService } from '../../services/deployments-status-management-service'
import { ConsoleLoggerService } from '../../logs/console'

@Injectable()
export class SpinnakerService {

  constructor(
    private readonly httpService: HttpService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService,
    private readonly consoleLoggerService: ConsoleLoggerService
  ) {}

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

    const unusedVersions = pipelineOptions.pipelineVersions.filter( v => !currentVersions.includes(v) )

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
    circles: CircleDeploymentEntity[]
  ): void {

    circles
      .filter(circle => circle.removeCircle)
      .map(circle => this.removeCircleFromPipeline(pipelineOptions, circle))
  }

  private removeRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    defaultCircle: boolean
  ): void {

    defaultCircle ?
      this.removeRequestedHeaderlessCircles(pipelineOptions) :
      this.removeRequestedRoutedCircles(pipelineOptions, circles)
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
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): void {

    circles
      .filter(circle => !circle.removeCircle)
      .map(circle => this.updatePipelineCircle(circle, pipelineOptions, componentDeployment))
  }

  private updateRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): void {

    defaultCircle ?
      this.updateRequestedHeaderlessCircles(pipelineOptions, componentDeployment) :
      this.updateRequestedRoutedCircles(pipelineOptions, circles, componentDeployment)
  }

  private updatePipelineCircles(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineCircle[] {

    this.removeRequestedCircles(pipelineOptions, circles, defaultCircle)
    this.updateRequestedCircles(pipelineOptions, circles, componentDeployment, defaultCircle)
    return pipelineOptions.pipelineCircles
  }

  public updatePipelineOptions(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineOptions {

    this.updatePipelineCircles(
      pipelineOptions, circles, componentDeployment, defaultCircle
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
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return circles
      .filter(circle => !circle.removeCircle)
      .map(circle => this.getNewPipelineRoutedCircleObject(circle, componentDeployment))
  }

  private getNewPipelineCircles(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineCircle[] {

    return defaultCircle ?
      this.getNewPipelineHeaderlessCircles(componentDeployment) :
      this.getPipelineRoutedCircles(circles, componentDeployment)
  }

  public createNewPipelineOptions(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity,
    defaultCircle: boolean
  ): IPipelineOptions {

    return {
      pipelineCircles: this.getNewPipelineCircles(circles, componentDeployment, defaultCircle),
      pipelineVersions: this.getNewPipelineVersions(componentDeployment),
      pipelineUnusedVersions: []
    }
  }

  private async deploySpinnakerPipeline(pipelineName: string): Promise<void> {

    await this.waitForPipelineCreation()
    this.consoleLoggerService.log(`START:DEPLOY_SPINNAKER_PIPELINE ${pipelineName}`)
    await this.httpService.post(
      `${AppConstants.SPINNAKER_URL}/webhooks/webhook/${pipelineName}`,
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
    return `${AppConstants.DARWIN_NOTIFICATION_URL}?componentDeploymentId=${componentDeploymentId}`
  }

  private createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string
  ): ISpinnakerPipelineConfiguration {

    return {
      ...deploymentConfiguration,
      webhookUri: this.getSpinnakerCallbackUrl(componentDeploymentId),
      versions: pipelineCirclesOptions.pipelineVersions,
      unusedVersions: pipelineCirclesOptions.pipelineUnusedVersions,
      circles: pipelineCirclesOptions.pipelineCircles
    }
  }

  private async getSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration
  ) {

    return await createSpinnakerPipeline(
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
        `${AppConstants.SPINNAKER_URL}/pipelines`,
        pipeline,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).toPromise()
    } catch (error) {
      console.log(error)
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
      `${AppConstants.SPINNAKER_URL}/pipelines`,
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
    const response = await this.httpService.get(
      `${AppConstants.SPINNAKER_URL}/applications/${applicationName}/pipelineConfigs/${pipelineName}`
    ).toPromise()
    const { data: { id } } = response
    return id
  }

  private getCreateSpinnakerApplicationObject(applicationName: string): Object {
    return {
      job: [{
        type: 'createApplication',
        application: {
          cloudProviders: 'kubernetes',
          instancePort: 80,
          name: applicationName,
          email: `${applicationName}@${applicationName}.com`
        }
      }],
      application: applicationName
    }
  }

  private async createSpinnakerApplication(applicationName: string): Promise<void> {
    const createApplicationObject: Object = this.getCreateSpinnakerApplicationObject(applicationName)

    await this.httpService.post(
      `${AppConstants.SPINNAKER_URL}/applications/${applicationName}/tasks`,
      createApplicationObject,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
  }

  private async getSpinnakerApplication(applicationName: string): Promise<string> {
    const { data: { name } } = await this.httpService.get(
      `${AppConstants.SPINNAKER_URL}/applications/${applicationName}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
    return name
  }

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string,
    deploymentId: string
  ): Promise<void> {

    this.consoleLoggerService.log(
      'START:CREATE_SPINNAKER_PIPELINE',
      { pipelineCirclesOptions, deploymentConfiguration, componentDeploymentId, deploymentId }
    )

    const spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration =
      this.createPipelineConfigurationObject(
        pipelineCirclesOptions, deploymentConfiguration, componentDeploymentId
      )

    const spinnakerApplication: string = await this.getSpinnakerApplication(deploymentConfiguration.applicationName)
    if (!spinnakerApplication) {
      await this.createSpinnakerApplication(deploymentConfiguration.applicationName)
    }

    const pipelineId: string = await this.checkPipelineExistence(
      spinnakerPipelineConfiguration.pipelineName, deploymentConfiguration.applicationName
    )

    pipelineId ?
      await this.updateSpinnakerPipeline(spinnakerPipelineConfiguration, pipelineId) :
      await this.createSpinnakerPipeline(spinnakerPipelineConfiguration)

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE', spinnakerPipelineConfiguration)

    this.deploySpinnakerPipeline(spinnakerPipelineConfiguration.pipelineName)
      .catch(() => this.setDeploymentStatusAsFailed(deploymentId))
  }
}
