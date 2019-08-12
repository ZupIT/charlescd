import { HttpService, Injectable } from '@nestjs/common'
import { CreateSpinnakerPipeline } from 'lib-spinnaker'
import { IPipelineCircle, IPipelineOptions, IPipelineVersion } from '../../../api/modules/interfaces'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../../../api/deployments/entity'
import { AppConstants } from '../../constants'
import { IDeploymentConfiguration } from '../configuration/interfaces'
import { ISpinnakerPipelineConfiguration } from './interfaces'
import { DeploymentStatusEnum } from '../../../api/deployments/enums'
import { DeploymentsStatusManagementService } from '../../services/deployments-status-management-service'

@Injectable()
export class SpinnakerService {

  constructor(
    private readonly httpService: HttpService,
    private readonly deploymentsStatusManagementService: DeploymentsStatusManagementService
  ) {}

  private checkVersionUsage(
    pipelineVersion: IPipelineVersion,
    pipelineCircles: IPipelineCircle[]
  ): boolean {

    return !!pipelineCircles.find(pipelineCircle =>
      !!pipelineCircle.destination.find(
        destination => destination.version === pipelineVersion.version
      )
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

    pipelineOptions.pipelineVersions = pipelineOptions.pipelineVersions.filter(
      pipelineVersion => this.checkVersionUsage(pipelineVersion, pipelineOptions.pipelineCircles)
    )
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

    pipelineOptions.pipelineCircles.forEach(pipelineCircle => {
      pipelineCircle.headers = pipelineCircle.headers.filter(
        header => header.headerValue !== circle.headerValue
      )
    })
    pipelineOptions.pipelineCircles = pipelineOptions.pipelineCircles.filter(
        pipelineCircle => pipelineCircle.headers.length
    )
  }

  private removeRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[]
  ): void {

    circles
      .filter(circle => circle.removeCircle)
      .map(circle => this.removeCircleFromPipeline(pipelineOptions, circle))
  }

  private addCircleToPipeline(
    pipelineOptions: IPipelineOptions,
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    pipelineOptions.pipelineCircles.push(
      this.getNewPipelineCircleObject(circle, componentDeployment)
    )
  }

  private updatePipelineCircle(
    circle: CircleDeploymentEntity,
    pipelineOptions: IPipelineOptions,
    componentDeployment: ComponentDeploymentEntity
  ): void {

    this.removeCircleFromPipeline(pipelineOptions, circle)
    this.addCircleToPipeline(pipelineOptions, circle, componentDeployment)
  }

  private updateRequestedCircles(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): void {

    circles
      .filter(circle => !circle.removeCircle)
      .map(circle => this.updatePipelineCircle(circle, pipelineOptions, componentDeployment))
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

    const pipelineCircles = this.updatePipelineCircles(
      pipelineOptions, circles, componentDeployment
    )
    const pipelineVersions = this.updatePipelineVersions(
      pipelineOptions, componentDeployment
    )
    return { pipelineCircles, pipelineVersions }
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

  private getNewPipelineCircleObject(
    circle: CircleDeploymentEntity,
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle {

    return {
      headers: [{
        headerName: AppConstants.DEFAULT_CIRCLE_HEADER_NAME,
        headerValue: circle.headerValue
      }],
      destination: [{
        version: componentDeployment.buildImageTag
      }]
    }
  }

  private getNewPipelineCircles(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineCircle[] {

    return circles
      .filter(circle => !circle.removeCircle)
      .map(circle => this.getNewPipelineCircleObject(circle, componentDeployment))
  }

  public createNewPipelineOptions(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineOptions {

    return {
      pipelineCircles: this.getNewPipelineCircles(circles, componentDeployment),
      pipelineVersions: this.getNewPipelineVersions(componentDeployment)
    }
  }

  private async deploySpinnakerPipeline(pipelineName: string): Promise<void> {
    await this.waitForPipelineCreation()
    await this.httpService.post(
      `${AppConstants.SPINNAKER_URL}/webhooks/webhook/${pipelineName}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
  }

  private getSpinnakerCallbackUrl(componentDeploymentId: string): string {
    return `${AppConstants.DARWIN_DEPLOY_URL}?componentDeploymentId=${componentDeploymentId}`
  }

  private createPipelineConfigurationObject(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string
  ): ISpinnakerPipelineConfiguration {

    return {
      ...deploymentConfiguration,
      webhookUri: this.getSpinnakerCallbackUrl(componentDeploymentId),
      subsets: pipelineCirclesOptions.pipelineVersions,
      circle: pipelineCirclesOptions.pipelineCircles
    }
  }

  private async getSpinnakerPipeline(
    spinnakerPipelineConfiguration: ISpinnakerPipelineConfiguration
  ): Promise<void> {

    return await CreateSpinnakerPipeline(
      AppConstants.TEMPLATE_GITHUB_AUTH,
      AppConstants.TEMPLATE_GITHUB_USER,
      AppConstants.TEMPLATE_GITHUB_REPO,
      AppConstants.TEMPLATE_GITHUB_FOLDER,
      spinnakerPipelineConfiguration,
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
  }

  private async setDeploymentStatusAsFailed(deploymentId: string): Promise<void> {
    await this.deploymentsStatusManagementService
      .deepUpdateDeploymentStatusByDeploymentId(deploymentId, DeploymentStatusEnum.FAILED)
  }

  private async checkPipelineExistence(pipelineName: string): Promise<void> {
    await this.
  }

  public async createDeployment(
    pipelineCirclesOptions: IPipelineOptions,
    deploymentConfiguration: IDeploymentConfiguration,
    componentDeploymentId: string,
    deploymentId: string
  ): Promise<void> {

    const spinnakerPipelineConfiguraton: ISpinnakerPipelineConfiguration =
      this.createPipelineConfigurationObject(pipelineCirclesOptions, deploymentConfiguration, componentDeploymentId)

    await this.checkPipelineExistence(spinnakerPipelineConfiguraton.pipelineName)

    await this.createSpinnakerPipeline(spinnakerPipelineConfiguraton)

    this.deploySpinnakerPipeline(spinnakerPipelineConfiguraton.pipelineName)
      .catch(() => this.setDeploymentStatusAsFailed(deploymentId))
  }
}
