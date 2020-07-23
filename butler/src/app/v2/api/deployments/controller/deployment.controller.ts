import { Controller, Post } from '@nestjs/common';

@Controller('v2/deployments')
export class DeploymentsController {

  @Post()
  public async createDeployment() {
    return 'ok'
  }
}
