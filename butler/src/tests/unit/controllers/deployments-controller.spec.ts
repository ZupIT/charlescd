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
import { DeploymentsController } from '../../../app/api/deployments/controller'
import { DeploymentsService } from '../../../app/api/deployments/services'
import { DeploymentsServiceStub } from '../../stubs'
import { ReadDeploymentDto } from '../../../app/api/deployments/dto'
import {
    CreateCircleDeploymentRequestUsecase,
    CreateDefaultDeploymentRequestUsecase,
    CreateUndeploymentRequestUsecase
} from '../../../app/api/deployments/use-cases'
import {
    CreateCircleDeploymentRequestUsecaseStub,
    CreateUndeploymentRequestUsecaseStub
} from '../../stubs/use-cases'
import {
    ComponentsRepositoryStub,
    DeploymentsRepositoryStub,
    ModulesRepositoryStub
} from '../../stubs/repository'

describe('DeploymentsController', () => {

    let deploymentsController: DeploymentsController
    let deploymentsService: DeploymentsService

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                DeploymentsController
            ],
            providers: [
                {
                    provide: DeploymentsService,
                    useClass: DeploymentsServiceStub
                },
                {
                    provide: CreateUndeploymentRequestUsecase,
                    useClass: CreateUndeploymentRequestUsecaseStub
                },
                {
                    provide: CreateCircleDeploymentRequestUsecase,
                    useClass: CreateCircleDeploymentRequestUsecaseStub
                },
                {
                    provide: CreateDefaultDeploymentRequestUsecase,
                    useClass: CreateCircleDeploymentRequestUsecaseStub
                },
                {
                    provide: 'DeploymentEntityRepository',
                    useClass: DeploymentsRepositoryStub
                },
                {
                    provide: 'ModuleEntityRepository',
                    useClass: ModulesRepositoryStub
                },
                {
                    provide: 'ComponentEntityRepository',
                    useClass: ComponentsRepositoryStub
                }
            ]
        }).compile()

        deploymentsService = module.get<DeploymentsService>(DeploymentsService)
        deploymentsController = module.get<DeploymentsController>(DeploymentsController)
    })

    describe('getDeployments', () => {
        it('should return an empty array of deployments representations', async () => {
            const result: ReadDeploymentDto[] = []
            jest.spyOn(deploymentsService, 'getDeployments').mockImplementation(() => Promise.resolve(result))
            expect(await deploymentsController.getDeployments()).toBe(result)
        })
    })
})
