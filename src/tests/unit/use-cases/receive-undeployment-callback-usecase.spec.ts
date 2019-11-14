import { Test } from '@nestjs/testing'
import { ReceiveUndeploymentCallbackUsecase } from '../../../app/api/notifications/use-cases'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import {
    ConsoleLoggerServiceStub,
    MooveServiceStub,
    PipelineQueuesServiceStub,
    StatusManagementServiceStub
} from '../../stubs/services'
import { MooveService } from '../../../app/core/integrations/moove'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { PipelineQueuesService } from '../../../app/api/deployments/services'
import {
    ComponentUndeploymentsRepositoryStub,
    DeploymentsRepositoryStub,
    QueuedUndeploymentsRepositoryStub
} from '../../stubs/repository'
import { ComponentUndeploymentsRepository } from '../../../app/api/deployments/repository'

describe('ReceiveUndeploymentCallbackUsecase', () => {

    let receiveUndeploymentCallbackUsecase: ReceiveUndeploymentCallbackUsecase

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                ReceiveUndeploymentCallbackUsecase,
                { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
                { provide: MooveService, useClass: MooveServiceStub },
                { provide: StatusManagementService, useClass: StatusManagementServiceStub },
                { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
                { provide: 'QueuedUndeploymentEntityRepository', useClass: QueuedUndeploymentsRepositoryStub },
                { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
                { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
            ]
        }).compile()

        receiveUndeploymentCallbackUsecase = module.get<ReceiveUndeploymentCallbackUsecase>(ReceiveUndeploymentCallbackUsecase)
    })

    describe('execute', () => {
        it('should return the correct healthcheck status', async () => {
            // const result: IReadHealthcheckStatus = { status: HealthcheckStatusEnum.OK }
            // jest.spyOn(healthcheckService, 'getHealthcheckStatus')
            //     .mockImplementation(() => ({ status: HealthcheckStatusEnum.OK }))
            // expect(await healthcheckController.getHealthcheck()).toEqual(result)
        })
    })
})
