import { HttpService, Injectable } from '@nestjs/common';
import { CreateSpinnakerPipeline } from 'lib-spinnaker';

@Injectable()
export class SpinnakerService {

  constructor(private readonly httpService: HttpService) {}

  public getPipelines(): string[] {
    return [
      'pipeline 1',
      'pipeline 2'
    ];
  }

  public async createPipeline(data): Promise<void> {
    const pipeline = await CreateSpinnakerPipeline(
      data.auth,
      data.githubUser,
      data.repo,
      data.folder,
      data.contract,
    );
    const result = await this.httpService.post(
      'https://darwin-spinnaker-gate.continuousplatform.com/pipelines',
      pipeline,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise();
    await this.httpService.post(
      `https://darwin-spinnaker-gate.continuousplatform.com/webhooks/webhook/${data.contract.pipelineName}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise();
  }
}
