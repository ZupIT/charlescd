import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common'
import {
  CreateDeploymentRequest,
  DeploymentRepresentation,
  UpdateDeploymentRequest
} from '../interfaces'
import { DeploymentsService } from '../service'

@Controller('deployments')
export class DeploymentsController {

  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post()
  public createDeployment(
    @Body() createDeploymentRequest: CreateDeploymentRequest
  ): DeploymentRepresentation {
    return this.deploymentsService.createDeployment(createDeploymentRequest)
  }

  @Get()
  public getDeployments(): DeploymentRepresentation[] {
    return this.deploymentsService.getDeployments()
  }

  @Get(':id')
  public getDeploymentById(@Param('id') id: string): DeploymentRepresentation {
    return this.deploymentsService.getDeploymentById(id)
  }

  @Put(':id')
  public updateDeployment(
    @Param('id') id: string,
    @Body() updateDeploymentRequest: UpdateDeploymentRequest
  ): DeploymentRepresentation {
    return this.deploymentsService.updateDeployment(id)
  }

  @Delete(':id')
  public deleteDeployment(@Param('id') id: string) {
    return this.deploymentsService.deleteDeployment(id)
  }
}
