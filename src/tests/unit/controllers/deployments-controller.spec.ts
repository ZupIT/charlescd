import { Test } from '@nestjs/testing'
import { DeploymentsController } from '../../../app/api/deployments/controller'
import { DeploymentsService } from '../../../app/api/deployments/services'
import { DeploymentsServiceStub } from '../../stubs'
import { ReadDeploymentDto } from '../../../app/api/deployments/dto'
import { CreateUndeploymentRequestUsecase } from '../../../app/api/deployments/use-cases'
import { CreateUndeploymentRequestUsecaseStub } from '../../stubs/use-cases'

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
