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
    return this.modulesRepository.findOneOrFail({ id })
      .then(deployment => deployment.toReadDto())
  }
}
