import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { ReadK8sConfigurationDto } from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { K8sConfigurationsRepository } from '../repository'
import { K8sConfigurationEntity } from '../entity'

@Injectable()
export class GetK8sConfigurationsUsecase {

    constructor(
        @InjectRepository(K8sConfigurationsRepository)
        private readonly k8sConfigurationsRepository: K8sConfigurationsRepository
    ) {}

    public async execute(applicationId: string): Promise<ReadK8sConfigurationDto[]> {

        try {
            const k8sConfigurations: K8sConfigurationEntity[] =
                await this.k8sConfigurationsRepository.findAllByApplicationId(applicationId)
            return k8sConfigurations.map(configuration => configuration.toReadDto())
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
