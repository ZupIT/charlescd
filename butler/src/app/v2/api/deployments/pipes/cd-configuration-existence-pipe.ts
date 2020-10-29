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

import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CdConfigurationsRepository } from '../../../../v1/api/configurations/repository'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'

@Injectable()
export class CdConfigurationExistencePipe implements PipeTransform {
  constructor(
    @InjectRepository(CdConfigurationsRepository)
    private componentRepository: CdConfigurationsRepository) {
  }

  public async transform(createDeploymentDto: CreateDeploymentRequestDto) : Promise<CreateDeploymentRequestDto> {
    const cdConfiguration = await this.componentRepository.findDecrypted(createDeploymentDto.cdConfigurationId)

    if (cdConfiguration) {
      createDeploymentDto.cdConfiguration = cdConfiguration
      return createDeploymentDto
    }
    throw new NotFoundException(`Configuration with the id ${createDeploymentDto.cdConfigurationId} was not found`)
  }
}
