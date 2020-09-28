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

import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CdConfigurationsRepository } from '../../../../v1/api/configurations/repository'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { CreateModuleDeploymentDto } from '../dto/create-module-request.dto'
import { CreateComponentRequestDto } from '../dto/create-component-request.dto'
import { CdConfigurationEntity } from '../../../../v1/api/configurations/entity'
import { ComponentsRepositoryV2 } from '../repository'
import * as util from 'util'

@Injectable()
export class UniquenessComponentNameByNamespacePipe implements PipeTransform {
  constructor(
    @InjectRepository(ComponentsRepositoryV2)
    private componentsRepository: ComponentsRepositoryV2,
    @InjectRepository(CdConfigurationsRepository)
    private cdConfigurationRepository: CdConfigurationsRepository) {
  }

  public async transform(createDeploymentDto: CreateDeploymentRequestDto) : Promise<CreateDeploymentRequestDto> {
    const cdConfiguration = await this.cdConfigurationRepository.findDecrypted(createDeploymentDto.cdConfigurationId)
    const result = await Promise.all(
      createDeploymentDto.modules.map(
        module => this.verifyExistenceofModuleComponentsInAnotherNamespace(module, cdConfiguration)
      )
    )

    return createDeploymentDto
  }

  private verifyExistenceofModuleComponentsInAnotherNamespace(module: CreateModuleDeploymentDto, configuration: CdConfigurationEntity) {
    return Promise.all(
      module.components.map(
        component => this.verifyExistenceofComponentInAnotherNamespace(component, configuration)
      )
    )
  }

  private async verifyExistenceofComponentInAnotherNamespace(component: CreateComponentRequestDto, configuration: CdConfigurationEntity) {
    const componentsInAnotherNamespace =  await this.componentsRepository.
      findComponentDeploymentInAnotherNamespace(component, this.getDeployNamespace(component, configuration))
    if (componentsInAnotherNamespace && componentsInAnotherNamespace.length) {
      console.log(util.inspect(componentsInAnotherNamespace, false, 3))
      throw new UnprocessableEntityException('Component already deployed in another namespace')
    }
  }

  private getDeployNamespace(component: CreateComponentRequestDto, configuration: CdConfigurationEntity) {
    return component.namespace || configuration.configurationData.namespace
  }
}
