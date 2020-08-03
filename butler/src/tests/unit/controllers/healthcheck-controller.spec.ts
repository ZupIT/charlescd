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
import { HealthcheckController } from '../../../app/v1/api/healthcheck/controller'
import { HealthcheckService } from '../../../app/v1/api/healthcheck/services'
import { HealthcheckStatusEnum } from '../../../app/v1/api/healthcheck/enums'
import { HealthcheckServiceStub } from '../../stubs/services/healthcheck-service.stub'
import { IReadHealthcheckStatus } from '../../../app/v1/api/healthcheck/interfaces'

describe('HealthcheckController', () => {

  let healthcheckController: HealthcheckController
  let healthcheckService: HealthcheckService

  beforeEach(async() => {

    const module = await Test.createTestingModule({
      controllers: [
        HealthcheckController
      ],
      providers: [
        {
          provide: HealthcheckService,
          useClass: HealthcheckServiceStub
        }
      ]
    }).compile()

    healthcheckService = module.get<HealthcheckService>(HealthcheckService)
    healthcheckController = module.get<HealthcheckController>(HealthcheckController)
  })

  describe('getHealthcheck', () => {
    it('should return the correct healthcheck status', async() => {
      const result: IReadHealthcheckStatus = { status: HealthcheckStatusEnum.OK }
      jest.spyOn(healthcheckService, 'getHealthcheckStatus')
        .mockImplementation(() => ({ status: HealthcheckStatusEnum.OK }))
      expect(await healthcheckController.getHealthcheck()).toEqual(result)
    })
  })
})
