import { HttpService, Injectable } from '@nestjs/common'
import { CreateSpinnakerPipeline } from 'lib-spinnaker'
import { IPipelineCircle, IPipelineOptions, IPipelineVersion } from '../../../api/modules/interfaces'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../../../api/deployments/entity'

@Injectable()
export class SpinnakerService {

  constructor(private readonly httpService: HttpService) {}

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
      pipelineVersion => pipelineVersion.version !== componentDeployment.buildImageName
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
      version: componentDeployment.buildImageName,
      versionTag: componentDeployment.buildImageTag
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
        headerName: 'x-darwin-circle',
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

  public async createPipeline(data): Promise<void> {
    const pipeline = await CreateSpinnakerPipeline(
      data.auth,
      data.githubUser,
      data.repo,
      data.folder,
      data.contract,
    )
    const result = await this.httpService.post(
      'https://darwin-spinnaker-gate.continuousplatform.com/pipelines',
      pipeline,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
    await this.httpService.post(
      `https://darwin-spinnaker-gate.continuousplatform.com/webhooks/webhook/${data.contract.pipelineName}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise()
  }
}
