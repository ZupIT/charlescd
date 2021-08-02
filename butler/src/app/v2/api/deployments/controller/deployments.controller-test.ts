
import { Body, Controller, Get, Headers, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { validate as uuidValidate } from 'uuid'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { ReadDeploymentDto } from '../dto/read-deployment.dto'
import { ReadUndeploymentDto } from '../dto/read-undeployment.dto'
import { CreateDeploymentUseCase } from '../use-cases/create-deployment.usecase'
import { CreateUndeploymentUseCase } from '../use-cases/create-undeployment.usecase'
import { DeploymentUniquenessPipe } from '../pipes/deployment-uniqueness.pipe'
import { UndeploymentValidation } from '../pipes/undeployment-validation.pipe'
import { JoiValidationPipe } from '../pipes/joi-validation-pipe'
import { GitTokenDecryptionPipe } from '../pipes/git-token-decryption.pipe'
import { DefaultCircleUniquenessPipe } from '../pipes/default-circle-uniqueness.pipe'
import { NamespaceValidationPipe } from '../pipes/namespace-validation.pipe'
import { FindDeploymentLogsByIdUsecase } from '../use-cases/find-deployment-logs-by-id.usecase'
import { ReadLogsDto } from '../dto/read-logs.dto'
import { ExceptionBuilder } from '../../../core/utils/exception.utils'

@Controller('v3/deployments')
export class DeploymentsController2 {

  constructor(
    private createDeploymentUseCase: CreateDeploymentUseCase,
    private createUndeploymentUseCase: CreateUndeploymentUseCase,
    private findDeploymentLogsByIdUseCase: FindDeploymentLogsByIdUsecase
  ) { }

  @Post('/')
  @UsePipes(GitTokenDecryptionPipe)
  @UsePipes(DeploymentUniquenessPipe)
  @UsePipes(DefaultCircleUniquenessPipe)
  @UsePipes(NamespaceValidationPipe)
  @UsePipes(new JoiValidationPipe())
  public async createDeployment(
    @Body() createDeploymentRequestDto: CreateDeploymentRequestDto,
    @Headers('x-circle-id') incomingCircleId: string | undefined,
  ): Promise<ReadDeploymentDto> {
    console.log('aloi')
    const processedIncomingCircleId = this.processIncomingCircleIdHeader(incomingCircleId)
    return this.createDeploymentUseCase.execute(createDeploymentRequestDto, processedIncomingCircleId)
  }

  @Get('/:id/logs')
  @UsePipes(new ValidationPipe({ transform: true }))
  public async findDeploymentEvents(
      @Param('id') deploymentId: string,
  ): Promise<ReadLogsDto> {
    return this.findDeploymentLogsByIdUseCase.execute(deploymentId)
  }

  @Post('/:id/undeploy')
  @UsePipes(UndeploymentValidation)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createUndeployment(
    @Param('id') deploymentId: string,
    @Headers('x-circle-id') incomingCircleId: string | undefined
  ): Promise<ReadUndeploymentDto> {
    const processedIncomingCircleId = this.processIncomingCircleIdHeader(incomingCircleId)
    return this.createUndeploymentUseCase.execute(deploymentId, processedIncomingCircleId)
  }

  private processIncomingCircleIdHeader(incomingCircleId: string | undefined): string | null {
    if (incomingCircleId === undefined) {
      return null
    }

    if (!uuidValidate(incomingCircleId)) {
      throw new ExceptionBuilder('x-circle-id must be UUID', HttpStatus.UNPROCESSABLE_ENTITY).build()
    }

    return incomingCircleId
  }
}
