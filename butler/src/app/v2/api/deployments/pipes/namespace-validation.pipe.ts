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

import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { DeploymentEntityV2 as DeploymentEntity } from '../entity/deployment.entity'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { K8sClient } from '../../../core/integrations/k8s/client'
import { ExceptionBuilder } from '../../../core/utils/exception.utils'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'


@Injectable()
export class NamespaceValidationPipe implements PipeTransform {

  constructor(
    @InjectRepository(DeploymentEntity)
    private readonly deploymentsRepository: Repository<DeploymentEntity>,
    private readonly k8sClient: K8sClient
  ) {}

  public async transform(deploymentRequest: CreateDeploymentRequestDto): Promise<CreateDeploymentRequestDto> {
    
    const response = await this.k8sClient.getNamespace(deploymentRequest.namespace)

    if (response.body.status?.phase !== 'Active') {
      throw new ExceptionBuilder(
        `invalid namespace '${deploymentRequest.namespace}' `,
        HttpStatus.BAD_REQUEST)
        .withDetail('namespace does not exist or is not active')
        .build()
    }
    return deploymentRequest
  }
}
