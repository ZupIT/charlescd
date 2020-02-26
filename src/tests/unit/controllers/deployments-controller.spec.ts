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
import { DeploymentsRepositoryStub } from '../../stubs/repository'

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
