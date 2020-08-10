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

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { ComponentsRepositoryV2 } from '../repository'

@Injectable()
export class SimultaneousDeploymentValidationPipe implements PipeTransform {

  constructor(
    @InjectRepository(ComponentsRepositoryV2)
    private componentsRepository: ComponentsRepositoryV2) {
  }

  async transform(createDeploymentDto: CreateDeploymentRequestDto) : Promise<CreateDeploymentRequestDto> {
    const circleId = createDeploymentDto.circle?.headerValue
    const runningComponents = circleId ?
      await this.componentsRepository.findCircleRunningComponents(circleId) :
      await this.componentsRepository.findDefaultRunningComponents()

    if (runningComponents && runningComponents.length > 0) {
      throw new BadRequestException('Simultaneous deployments are not allowed for a given circle')
    }

    return createDeploymentDto
  }
}
