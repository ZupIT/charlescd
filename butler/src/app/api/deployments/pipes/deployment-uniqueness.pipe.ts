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
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common'
import { CreateDeploymentRequestDto } from '../dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEntity } from '../entity'
import { Repository } from 'typeorm'

@Injectable()
export class DeploymentUniquenessPipe implements PipeTransform {

  constructor(
        @InjectRepository(DeploymentEntity)
        private readonly deploymentsRepository: Repository<DeploymentEntity>
  ) {}

  public async transform(deploymentRequest: CreateDeploymentRequestDto): Promise<CreateDeploymentRequestDto> {
    const deployment: DeploymentEntity | undefined =
            await this.deploymentsRepository.findOne({ id: deploymentRequest.deploymentId })
    if (deployment) {
      throw new BadRequestException('Deployment already exists')
    }
    return deploymentRequest
  }
}
