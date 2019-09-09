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
      SpinnakerService.getNewPipelineVersionObject(componentDeployment)
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
      return pipelineCircle.header.headerValue !== circle.headerValue
    })
  }

  private static removeRequestedHeaderlessCircles(
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
    circles: CircleDeploymentEntity[]
  ): void {

    circles && circles.length ?
      this.removeRequestedRoutedCircles(pipelineOptions, circles) :
      SpinnakerService.removeRequestedHeaderlessCircles(pipelineOptions)
  }

  private static addCircleToPipeline(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles.push(
      SpinnakerService.getNewPipelineRoutedCircleObject(circle, componentDeployment)
    )
  }

  private updatePipelineCircle(
    circle: CircleDeploymentEntity,
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    this.removeCircleFromPipeline(pipelineOptions, circle)
    SpinnakerService.addCircleToPipeline(pipelineOptions, circle, componentDeployment)
  }

  private static updateRequestedHeaderlessCircles(
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles.push(
      SpinnakerService.getPipelineHeaderlessCircleObject(componentDeployment)
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
    componentDeployment: ComponentDeploymentEntity
  ): void {

    circles && circles.length ?
      this.updateRequestedRoutedCircles(pipelineOptions, circles, componentDeployment) :
      SpinnakerService.updateRequestedHeaderlessCircles(pipelineOptions, componentDeployment)
  }

  private updatePipelineCircles(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    this.removeRequestedCircles(pipelineOptions, circles)
    this.updateRequestedCircles(pipelineOptions, circles, componentDeployment)
    return pipelineOptions.pipelineCircles
  }

  public updatePipelineOptions(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineOptions {

    this.updatePipelineCircles(
      pipelineOptions, circles, componentDeployment
    )

    this.updatePipelineVersions(
      pipelineOptions, componentDeployment
    )

    return pipelineOptions
  }

  private static getNewPipelineVersionObject(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion {

    return {
      versionUrl: componentDeployment.buildImageUrl,
      version: componentDeployment.buildImageTag
    }
  }

  private static getNewPipelineVersions(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineVersion[] {

    return [
      SpinnakerService.getNewPipelineVersionObject(componentDeployment)
    ]
  }

  private static getNewPipelineRoutedCircleObject(
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

  private static getPipelineHeaderlessCircleObject(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle {

    return {
      destination: {
        version: componentDeployment.buildImageTag
      }
    }
  }

  private static getNewPipelineHeaderlessCircles(
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return [
      SpinnakerService.getPipelineHeaderlessCircleObject(componentDeployment)
    ]
  }

  private getPipelineRoutedCircles(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return circles
      .filter(circle => !circle.removeCircle)
      .map(circle => SpinnakerService.getNewPipelineRoutedCircleObject(circle, componentDeployment))
  }

  private getNewPipelineCircles(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return circles && circles.length ?
      this.getPipelineRoutedCircles(circles, componentDeployment) :
      SpinnakerService.getNewPipelineHeaderlessCircles(componentDeployment)
  }

  public createNewPipelineOptions(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineOptions {

    return {
      pipelineCircles: this.getNewPipelineCircles(circles, componentDeployment),
      pipelineVersions: SpinnakerService.getNewPipelineVersions(componentDeployment),
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

  private static getSpinnakerCallbackUrl(componentDeploymentId: string): string {
    return `${AppConstants.DARWIN_NOTIFICATION_URL}?componentDeploymentId=${componentDeploymentId}`
  }

  private static createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string
  ): ISpinnakerPipelineConfiguration {

    return {
      ...deploymentConfiguration,
      webhookUri: SpinnakerService.getSpinnakerCallbackUrl(componentDeploymentId),
      versions: pipelineCirclesOptions.pipelineVersions,
      unusedVersions: pipelineCirclesOptions.pipelineUnusedVersions,
      circles: pipelineCirclesOptions.pipelineCircles
    }
  }

  private static async getSpinnakerPipeline(
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

    const pipeline = await SpinnakerService.getSpinnakerPipeline(spinnakerPipelineConfiguraton)
    await this.httpService.post(
      `${AppConstants.SPINNAKER_URL}/pipelines`,
      pipeline,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
  }

  private static createUpdatePipelineObject(
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

    const pipeline = await SpinnakerService.getSpinnakerPipeline(spinnakerPipelineConfiguraton)
    const updatePipelineObject =
      SpinnakerService.createUpdatePipelineObject(pipelineId, spinnakerPipelineConfiguraton, pipeline)

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

  private async checkPipelineExistence(pipelineName: string): Promise<string> {
    const { data: { id } } = await this.httpService.get(
      `${AppConstants.SPINNAKER_URL}/applications/testelucas/pipelineConfigs/${pipelineName}`
    ).toPromise()
    return id
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
      SpinnakerService.createPipelineConfigurationObject(
        pipelineCirclesOptions, deploymentConfiguration, componentDeploymentId
      )

    const pipelineId: string = await this.checkPipelineExistence(spinnakerPipelineConfiguration.pipelineName)
    pipelineId ?
      await this.updateSpinnakerPipeline(spinnakerPipelineConfiguration, pipelineId) :
      await this.createSpinnakerPipeline(spinnakerPipelineConfiguration)

    this.consoleLoggerService.log('FINISH:CREATE_SPINNAKER_PIPELINE', spinnakerPipelineConfiguration)

    this.deploySpinnakerPipeline(spinnakerPipelineConfiguration.pipelineName)
      .catch(() => this.setDeploymentStatusAsFailed(deploymentId))
  }
}
