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

import {
  Controller,
  Get,
  Param
} from '@nestjs/common'
import {
  ReadModuleDto
} from '../dto'
import { ModulesService } from '../services'
import { BaseController } from '../../base.controller'

@Controller('modules')
export class ModulesController extends BaseController {

  constructor(private readonly modulesService: ModulesService) { super() }

  @Get()
  public async getModules(): Promise<ReadModuleDto[]> {
    return await this.modulesService.getModules()
  }

  @Get(':id')
  public async getModuleById(@Param('id') id: string): Promise<ReadModuleDto> {
    return await this.modulesService.getModuleById(id)
  }

}
