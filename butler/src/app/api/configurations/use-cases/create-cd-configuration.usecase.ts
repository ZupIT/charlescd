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
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import {
  CreateCdConfigurationDto,
  ReadCdConfigurationDto
} from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CdConfigurationsRepository } from '../repository'
import { CdConfigurationEntity } from '../entity'
import { ConsoleLoggerService } from '../../../core/logs/console'

@Injectable()
export class CreateCdConfigurationUsecase {

  constructor(
        @InjectRepository(CdConfigurationsRepository)
        private readonly cdConfigurationsRepository: CdConfigurationsRepository,
        private readonly consoleLoggerService: ConsoleLoggerService
  ) {}

  public async execute(
    createCdConfigurationDto: CreateCdConfigurationDto,
    workspaceId: string
  ): Promise<ReadCdConfigurationDto> {

    try {
      this.consoleLoggerService.log('START:CREATE_CONFIGURATION', createCdConfigurationDto)
      const cdConfiguration: CdConfigurationEntity =
                await this.cdConfigurationsRepository.saveEncrypted(createCdConfigurationDto.toEntity(workspaceId))
      this.consoleLoggerService.log('FINISH:CREATE_CONFIGURATION', cdConfiguration)
      return cdConfiguration.toReadDto()
    } catch (error) {
      this.consoleLoggerService.error('ERROR:CREATE_CONFIGURATION: ', error)
      throw new InternalServerErrorException(error)
    }
  }
}
