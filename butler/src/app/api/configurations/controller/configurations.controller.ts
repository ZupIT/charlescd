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
  Body,
  Controller, Delete,
  Get,
  Headers, Param,
  Post,
  UsePipes
} from '@nestjs/common'
import {
  CreateCdConfigurationDto,
  ReadCdConfigurationDto
} from '../dto'
import {
  CreateCdConfigurationUsecase, DeleteCdConfigurationUsecase,
  GetCdConfigurationsUsecase
} from '../use-cases'
import { ValidConfigurationDataPipe } from '../pipes'

@Controller('configurations')
export class ConfigurationsController {

  constructor(
        private readonly createCdConfigurationUseCase: CreateCdConfigurationUsecase,
        private readonly getCdConfigurationsUseCase: GetCdConfigurationsUsecase,
        private readonly deleteCdConfigurationUsecase: DeleteCdConfigurationUsecase
  ) { }

    @UsePipes(ValidConfigurationDataPipe)
    @Post('cd')
  public async createCdConfiguration(
        @Body() createCdConfigurationDto: CreateCdConfigurationDto,
        @Headers('x-workspace-id') workspaceId: string
  ): Promise<ReadCdConfigurationDto> {

    return await this.createCdConfigurationUseCase.execute(createCdConfigurationDto, workspaceId)
  }

    @Get('cd')
    public async getCdConfigurations(
        @Headers('x-workspace-id') workspaceId: string
    ): Promise<ReadCdConfigurationDto[]> {

      return await this.getCdConfigurationsUseCase.execute(workspaceId)
    }

    @Delete('cd/:id')
    public async deleteCdConfigurations(
        @Param('id') id: string,
        @Headers('x-workspace-id') workspaceId: string
    ): Promise<void> {
      await this.deleteCdConfigurationUsecase.execute(id, workspaceId)
    }
}
