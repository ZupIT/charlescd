import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import {
    CreateCircleDeploymentRequestDto,
    ReadDeploymentDto
} from '../dto'
import { ConsoleLoggerService } from '../../../core/logs/console'

@Injectable()
export class CreateCircleDeploymentRequestUsecase {

    constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>,
        private readonly consoleLoggerService: ConsoleLoggerService
    ) {}

    public async execute(createCircleDeploymentRequestDto: CreateCircleDeploymentRequestDto, circleId: string): Promise<ReadDeploymentDto> {
        return {} as ReadDeploymentDto
    }
}
