import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UsePipes
} from '@nestjs/common'
import {
  CreateDeploymentDto,
  CreateUndeploymentDto,
  ReadDeploymentDto,
  ReadUndeploymentDto
} from '../dto'
import { DeploymentsService } from '../services'
import { CreateUndeploymentRequestUsecase } from '../use-cases'

@Controller('deployments')
export class DeploymentsController {

  constructor(
    private readonly deploymentsService: DeploymentsService,
    private readonly createUndeploymentRequestUsecase: CreateUndeploymentRequestUsecase
  ) {}

  @Post()
  public async createDeployment(
    @Body() createDeploymentDto: CreateDeploymentDto,
    @Headers('x-circle-id') circleId: string
  ): Promise<ReadDeploymentDto> {

    return await this.deploymentsService.createDeployment(createDeploymentDto, circleId)
  }

  @Post(':id/undeploy')
  public async createUndeployment(
    @Body() createUndeploymentDto: CreateUndeploymentDto,
    @Param('id') deploymentId: string
  ): Promise<ReadUndeploymentDto> {

    return await this.createUndeploymentRequestUsecase.execute(createUndeploymentDto, deploymentId)
  }

  @Get()
  public async getDeployments(): Promise<ReadDeploymentDto[]> {

    return await this.deploymentsService.getDeployments()
  }

  @Get(':id')
  public async getDeploymentById(@Param('id') id: string): Promise<ReadDeploymentDto> {

    return await this.deploymentsService.getDeploymentById(id)
  }
}
