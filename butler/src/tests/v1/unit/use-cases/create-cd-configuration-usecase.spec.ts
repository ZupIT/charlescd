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

import { Test } from '@nestjs/testing'
import { CdConfigurationsRepositoryStub } from '../../stubs/repository'
import { CreateCdConfigurationUsecase } from '../../../../app/v1/api/configurations/use-cases'
import { CdConfigurationsRepository } from '../../../../app/v1/api/configurations/repository'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CreateCdConfigurationDto } from '../../../../app/v1/api/configurations/dto'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { ConsoleLoggerService } from '../../../../app/v1/core/logs/console'
import { ConsoleLoggerServiceStub } from '../../stubs/services'

describe('CreateCdConfigurationUsecase', () => {

  let createCdConfigurationUsecase: CreateCdConfigurationUsecase
  let cdConfigurationsRepository: CdConfigurationsRepository
  let cdConfiguration: CdConfigurationEntity
  let createCdConfigurationDto: CreateCdConfigurationDto

  beforeEach(async() => {

    const module = await Test.createTestingModule({
      providers: [
        CreateCdConfigurationUsecase,
        { provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub },
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub }
      ]
    }).compile()

    createCdConfigurationUsecase = module.get<CreateCdConfigurationUsecase>(CreateCdConfigurationUsecase)
    cdConfigurationsRepository = module.get<CdConfigurationsRepository>(CdConfigurationsRepository)

    createCdConfigurationDto = new CreateCdConfigurationDto(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId'
    )

    cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
  })

  describe('execute', () => {
    it('should return the correct read dto for a given entity', async() => {

      jest.spyOn(cdConfigurationsRepository, 'saveEncrypted')
        .mockImplementation(() => Promise.resolve(cdConfiguration))

      expect(await createCdConfigurationUsecase.execute(createCdConfigurationDto, 'workspaceId'))
        .toEqual(cdConfiguration.toReadDto())
    })
  })
})
