import { Test } from '@nestjs/testing'
import { HealthcheckController } from '../../../app/api/healthcheck/controller'
import { HealthcheckStatusEnum } from '../../../app/api/healthcheck/enums'
import { IReadHealthcheckStatus } from '../../../app/api/healthcheck/interfaces'
import { CreateUndeploymentRequestUsecase } from '../../../app/api/deployments/use-cases'
import { QueuedDeploymentsRepository } from '../../../app/api/deployments/repository'
import {
    PipelineQueuesService,
    PipelinesService
} from '../../../app/api/deployments/services'
import {
    DeploymentsRepositoryStub,
    QueuedDeploymentsRepositoryStub,
    UndeploymentsRepositoryStub
} from '../../stubs/repository'
import {
    PipelineQueuesServiceStub,
    PipelinesServiceStub
} from '../../stubs/services'

describe('CreateUndeploymentRequestUsecase', () => {

    let createUndeploymentRequestUsecase: CreateUndeploymentRequestUsecase

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                HealthcheckController
            ],
            providers: [
                {
                    provide: 'DeploymentEntityRepository',
                    useClass: DeploymentsRepositoryStub
                },
                {
                    provide: 'UndeploymentEntityRepository',
                    useClass: UndeploymentsRepositoryStub
                },
                {
                    provide: QueuedDeploymentsRepository,
                    useClass: QueuedDeploymentsRepositoryStub
                },
                {
                    provide: PipelineQueuesService,
                    useClass: PipelineQueuesServiceStub
                },
                {
                    provide: PipelinesService,
                    useClass: PipelinesServiceStub
                }
            ]
        }).compile()

        createUndeploymentRequestUsecase = module.get<CreateUndeploymentRequestUsecase>(CreateUndeploymentRequestUsecase)
    })

    describe('getHealthcheck', () => {
        it('should return the correct healthcheck status', async () => {
            const result: IReadHealthcheckStatus = { status: HealthcheckStatusEnum.OK }
            jest.spyOn(healthcheckService, 'getHealthcheckStatus')
                .mockImplementation(() => ({ status: HealthcheckStatusEnum.OK }))
            expect(await healthcheckController.getHealthcheck()).toEqual(result)
        })
    })
})
