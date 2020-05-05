import { Injectable } from '@nestjs/common'
import {
    CreateModuleDto,
    ReadModuleDto
} from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ModuleEntity } from '../entity'
import { Repository } from 'typeorm'
import { ConsoleLoggerService } from '../../../core/logs/console';

@Injectable()
export class CreateModuleUsecase {

    constructor(
        @InjectRepository(ModuleEntity)
        private readonly moduleEntityRepository: Repository<ModuleEntity>,
        private readonly consoleLoggerService: ConsoleLoggerService
    ) {}

    public async execute(
        createModuleDto: CreateModuleDto
    ): Promise<ReadModuleDto> {

        try {
            this.consoleLoggerService.log('START:CREATE_MODULE')
            const moduleEntity: ModuleEntity =
                await this.moduleEntityRepository.save(createModuleDto.toEntity())
            this.consoleLoggerService.log('FINISH:CREATE_MODULE')
            return moduleEntity.toReadDto()
        } catch (error) {
            this.consoleLoggerService.error('ERROR:CREATE_MODULE', error)
            throw error
        }
    }
}
