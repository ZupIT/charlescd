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
import { CdConfigurationsRepository } from '../../../../app/v1/api/configurations/repository'
import { DeleteCdConfigurationUsecase } from '../../../../app/v1/api/configurations/use-cases'
import { CdConfigurationEntity } from '../../../../app/v1/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'

describe('DeleteCdConfigurationUsecase', () => {

  let deleteCdConfigurationUsecase: DeleteCdConfigurationUsecase
  let cdConfigurationsRepository: CdConfigurationsRepository
  let cdConfiguration: CdConfigurationEntity
  let cdConfigurationId: string
  let workspaceId: string

  beforeEach(async() => {

    const module = await Test.createTestingModule({
      providers: [
        DeleteCdConfigurationUsecase,
        { provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub }
      ]
    }).compile()

    cdConfigurationId = 'b801919e-9f23-41af-a446-6f829fce3910'
    workspaceId = '374c006b-8cfe-42d9-aea1-79b974c79262'
    deleteCdConfigurationUsecase = module.get<DeleteCdConfigurationUsecase>(DeleteCdConfigurationUsecase)
    cdConfigurationsRepository = module.get<CdConfigurationsRepository>(CdConfigurationsRepository)
    cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      workspaceId
    )

  })

  describe('execute', () => {
    it('should delete cd configuration according to cdConfigurationId and workspaceId', async() => {

      jest.spyOn(cdConfigurationsRepository, 'findDecrypted')
        .mockImplementation(() => Promise.resolve(cdConfiguration))

      const repositorySpy = jest.spyOn(cdConfigurationsRepository, 'delete')

      await deleteCdConfigurationUsecase.execute(cdConfigurationId, workspaceId)
      expect(repositorySpy).toHaveBeenCalledWith(cdConfigurationId)
    })
  })
})
