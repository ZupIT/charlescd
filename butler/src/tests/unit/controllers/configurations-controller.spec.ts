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
import {
  CreateCdConfigurationUsecaseStub, DeleteCdConfigurationUsecaseStub,
  GetCdConfigurationUsecaseStub
} from '../../stubs/use-cases'
import { ConfigurationsController } from '../../../app/api/configurations/controller'
import {
  CreateCdConfigurationUsecase, DeleteCdConfigurationUsecase,
  GetCdConfigurationsUsecase
} from '../../../app/api/configurations/use-cases'
import {
  CreateCdConfigurationDto,
  ReadCdConfigurationDto
} from '../../../app/api/configurations/dto'
import { CdTypeEnum } from '../../../app/api/configurations/enums'

describe('ConfigurationsController', () => {

  let configurationsController: ConfigurationsController
  let createK8sConfigurationUsecase: CreateCdConfigurationUsecase
  let createCdConfigurationDto: CreateCdConfigurationDto
  let getK8sConfigurationUsecase: GetCdConfigurationsUsecase

  beforeEach(async() => {

    const module = await Test.createTestingModule({
      controllers: [
        ConfigurationsController
      ],
      providers: [
        {
          provide: CreateCdConfigurationUsecase,
          useClass: CreateCdConfigurationUsecaseStub
        },
        {
          provide: GetCdConfigurationsUsecase,
          useClass: GetCdConfigurationUsecaseStub
        },
        {
          provide: DeleteCdConfigurationUsecase,
          useClass: DeleteCdConfigurationUsecaseStub
        }
      ]
    }).compile()

    configurationsController = module.get<ConfigurationsController>(ConfigurationsController)
    createK8sConfigurationUsecase = module.get<CreateCdConfigurationUsecase>(CreateCdConfigurationUsecase)
    getK8sConfigurationUsecase = module.get<GetCdConfigurationsUsecase>(GetCdConfigurationsUsecase)

    createCdConfigurationDto = new CreateCdConfigurationDto(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId'
    )
  })

  describe('createK8sConfigurationUsecase', () => {

    it('should return the same readK8sConfigurationDto that the usecase', async() => {

      const creationDate: Date = new Date()
      const readK8sConfigurationDto: ReadCdConfigurationDto = new ReadCdConfigurationDto(
        'id',
        createCdConfigurationDto.name,
        createCdConfigurationDto.authorId,
        'workspaceId',
        creationDate
      )

      jest.spyOn(createK8sConfigurationUsecase, 'execute')
        .mockImplementation(() => Promise.resolve(readK8sConfigurationDto))

      expect(
        await configurationsController.createCdConfiguration(createCdConfigurationDto, 'workspaceId')
      ).toBe(readK8sConfigurationDto)
    })
  })

  describe('getK8sConfigurationsUsecase', () => {

    it('should return the same readK8sConfigurationDto array that the usecase', async() => {

      const creationDate: Date = new Date()
      const readK8sConfigurationDto: ReadCdConfigurationDto = new ReadCdConfigurationDto(
        'id',
        createCdConfigurationDto.name,
        createCdConfigurationDto.authorId,
        'workspaceId',
        creationDate
      )
      const readK8sConfigurationDtoArray: ReadCdConfigurationDto[] = [readK8sConfigurationDto, readK8sConfigurationDto]

      jest.spyOn(getK8sConfigurationUsecase, 'execute')
        .mockImplementation(() => Promise.resolve(readK8sConfigurationDtoArray))

      expect(
        await configurationsController.getCdConfigurations('workspaceId')
      ).toBe(readK8sConfigurationDtoArray)
    })
  })
})
