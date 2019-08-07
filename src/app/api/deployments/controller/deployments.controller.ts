import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common'
import {
  CreateDeploymentDto,
  ReadDeploymentDto,
  UpdateDeploymentDto
} from '../dto'
import { DeploymentsService } from '../service'

@Controller('deployments')
export class DeploymentsController {

  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post()
  public createDeployment(
    @Body() createDeploymentDto: CreateDeploymentDto
  ): ReadDeploymentDto {
    return this.deploymentsService.createDeployment(createDeploymentDto)
  }

  @Get()
  public async getDeployments(): Promise<ReadDeploymentDto[]> {
    return await this.deploymentsService.getDeployments()
  }

  @Get(':id')
  public async getDeploymentById(@Param('id') id: string): Promise<ReadDeploymentDto> {
    return this.deploymentsService.getDeploymentById(id)
  }

  @Put(':id')
  public updateDeployment(
    @Param('id') id: string,
    @Body() updateDeploymentDto: UpdateDeploymentDto
  ): ReadDeploymentDto {
    return this.deploymentsService.updateDeployment(id, updateDeploymentDto)
  }

  @Delete(':id')
  public deleteDeployment(@Param('id') id: string) {
    return this.deploymentsService.deleteDeployment(id)
  }
}
