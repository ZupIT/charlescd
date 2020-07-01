/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
