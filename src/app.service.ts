import { Injectable, HttpService } from '@nestjs/common';
import { CreateSpinnakerPipeline } from 'lib-spinnaker';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }
  createPipeline = async (data: any) => {
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
    const promise = await this.httpService.post(
      `https://darwin-spinnaker-gate.continuousplatform.com/webhooks/webhook/${data.contract.pipelineName}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).toPromise();
    return "alegria"
  };
}
