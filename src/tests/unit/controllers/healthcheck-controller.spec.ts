import { Test } from '@nestjs/testing'
import { HealthcheckController } from '../../../app/api/healthcheck/controller'
import { HealthcheckService } from '../../../app/api/healthcheck/services'
import { HealthcheckStatusEnum } from '../../../app/api/healthcheck/enums'
import { HealthcheckServiceStub } from '../../stubs/services/healthcheck-service.stub'
import { IReadHealthcheckStatus } from '../../../app/api/healthcheck/interfaces'

describe('HealthcheckController', () => {

    let healthcheckController: HealthcheckController
    let healthcheckService: HealthcheckService

    beforeEach(async () => {

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
        it('should return the correct healthcheck status', async () => {
            const result: IReadHealthcheckStatus = { status: HealthcheckStatusEnum.OK }
            jest.spyOn(healthcheckService, 'getHealthcheckStatus')
                .mockImplementation(() => ({ status: HealthcheckStatusEnum.OK }))
            expect(await healthcheckController.getHealthcheck()).toEqual(result)
        })
    })
})
