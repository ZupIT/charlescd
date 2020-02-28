import { Injectable } from '@nestjs/common'
import {
    CreateModuleDto,
    ReadModuleDto
} from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ModuleEntity } from '../entity'
import { Repository } from 'typeorm'

@Injectable()
export class CreateModuleUsecase {

    constructor(
        @InjectRepository(ModuleEntity)
        private readonly moduleEntityRepository: Repository<ModuleEntity>
    ) {}

    public async execute(
        createModuleDto: CreateModuleDto
    ): Promise<ReadModuleDto> {

        try {
            const moduleEntity: ModuleEntity =
                await this.moduleEntityRepository.save(createModuleDto.toEntity())
            return moduleEntity.toReadDto()
        } catch (error) {
            throw error
        }
    }
}
