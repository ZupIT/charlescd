import { Injectable } from '@nestjs/common'
import { ModuleEntity } from '../entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ReadModuleDto } from '../dto'

@Injectable()
export class ModulesService {

  constructor(
    @InjectRepository(ModuleEntity)
    private readonly modulesRepository: Repository<ModuleEntity>
  ) {}

  private static async convertModulesToReadDto(modules: ModuleEntity[]): Promise<ReadModuleDto[]> {
    return modules.map(module => module.toReadDto())
  }

  public async getModules(): Promise<ReadModuleDto[]> {
    return this.modulesRepository.find()
      .then(modules => ModulesService.convertModulesToReadDto(modules))
  }

  public async getModuleById(id: string): Promise<ReadModuleDto> {
    return this.modulesRepository.findOne({ id })
      .then(deployment => deployment.toReadDto())
  }
}
