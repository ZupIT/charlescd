import { HttpService, Injectable } from '@nestjs/common'
import { CreateSpinnakerPipeline } from 'lib-spinnaker'
import { IPipelineOptions } from '../../../api/modules/interfaces'
import { CircleDeploymentEntity, ComponentDeploymentEntity } from '../../../api/deployments/entity'

@Injectable()
export class SpinnakerService {

  constructor(private readonly httpService: HttpService) {}

  public updatePipelineOptions(
    pipelineOptions: IPipelineOptions,
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineOptions {
    return {
      pipelineCircles: [],
      pipelineVersions: []
    }
  }

  public createNewPipelineOptions(
    circles: CircleDeploymentEntity[],
    componentDeployment: ComponentDeploymentEntity
  ): IPipelineOptions {
    return {
      pipelineCircles: [],
      pipelineVersions: []
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
