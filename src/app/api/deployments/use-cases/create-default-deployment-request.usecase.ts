import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'
import { CreateDefaultDeploymentRequestDto } from '../dto/create-deployment'
import { ReadDeploymentDto } from '../dto'

@Injectable()
export class CreateDefaultDeploymentRequestUsecase {

    constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>,
    ) {}

    public async execute(createDefaultDeploymentRequestDto: CreateDefaultDeploymentRequestDto, circleId: string): Promise<ReadDeploymentDto> {
        return {} as ReadDeploymentDto
    }
}
