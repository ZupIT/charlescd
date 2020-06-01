import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ModuleEntity } from '../../modules/entity'

@Injectable()
export class ModulesService {

    constructor(
        @InjectRepository(ModuleEntity)
        private readonly moduleEntityRepository: Repository<ModuleEntity>
    ) { }

    public async createModules(moduleEntities: ModuleEntity[]): Promise<void> {
        await this.verifyModuleExistAndSave(moduleEntities)
    }

    private async verifyModuleExistAndSave(moduleEntities: ModuleEntity[]): Promise<void> {
        await Promise.all(moduleEntities.map(moduleEntity => this.saveModule(moduleEntity)))
    }

    private async saveModule(moduleEntity: ModuleEntity) {
        const module = await this.moduleEntityRepository.findOne({ id: moduleEntity.id })

        if (module) {
            return
        }

        await this.moduleEntityRepository.save(moduleEntity)
    }

}
