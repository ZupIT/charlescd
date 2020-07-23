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

import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity'
import { CreateDeploymentRequestDto } from '../../../../v1/api/deployments/dto'

@Injectable()
export class CdConfigurationExistencePipe implements PipeTransform {
  constructor(
        @InjectRepository(CdConfigurationEntity)
        private componentRepository: Repository<CdConfigurationEntity>) {
  }

  async transform(createDeploymentDto: CreateDeploymentRequestDto) : Promise<CdConfigurationEntity> {
    const cdConfiguration = await this.componentRepository.findOne({ id: createDeploymentDto.cdConfigurationId })
    if (cdConfiguration) {
      return cdConfiguration
    }

    throw new NotFoundException(`Configuration with the id ${createDeploymentDto.cdConfigurationId} was not found`)
  }
}
