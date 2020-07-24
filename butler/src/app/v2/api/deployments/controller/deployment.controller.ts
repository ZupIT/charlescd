import { Body, Controller, Headers, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto';
import { CdConfigurationExistencePipe } from '../pipes/cd-configuration-existence-pipe';
import { DeploymentEntity } from '../entity/deployment.entity';

@Controller('v2/deployments')
export class DeploymentsController {

  @Post()
  @UsePipes(CdConfigurationExistencePipe)
  @UsePipes(new ValidationPipe({transform: true}))
  public async createDeployment(
    @Body() createDeploymentRequestDto: CreateDeploymentRequestDto,
    @Headers('x-circle-id') incomingCircleId: string,
  ): Promise<DeploymentEntity> {
    return createDeploymentRequestDto.toEntity()
  }
}
