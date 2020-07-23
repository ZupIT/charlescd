import { Body, Controller, Headers, Post, UsePipes } from '@nestjs/common';
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto';
import { DeployValidationPipe } from '../pipes/deploy-validation.pipe';
import { CdConfigurationExistencePipe } from '../pipes/cd-configuration-presence.pipe';

@Controller('v2/deployments')
export class DeploymentsController {

  @Post()
  @UsePipes(CdConfigurationExistencePipe)
  @UsePipes(new DeployValidationPipe())
  public async createDeployment(
    @Body() createDeploymentRequestDto: CreateDeploymentRequestDto,
    @Headers('x-circle-id') incomingCircleId: string,
  ): Promise<CreateDeploymentRequestDto> {
    return createDeploymentRequestDto
  }
}
