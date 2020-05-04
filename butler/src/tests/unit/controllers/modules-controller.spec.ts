import { Test } from '@nestjs/testing'
import { HealthcheckStatusEnum } from '../../../app/api/healthcheck/enums'
import { IReadHealthcheckStatus } from '../../../app/api/healthcheck/interfaces'
import { ModulesController } from '../../../app/api/modules/controller'
import { ModulesService } from '../../../app/api/modules/services'
import { CreateModuleUsecase } from '../../../app/api/modules/use-cases'
import { ModulesServiceStub } from '../../stubs/services'
import { CreateModuleUsecaseStub } from '../../stubs/use-cases'
import {
    CreateModuleDto,
    ReadModuleDto
} from '../../../app/api/modules/dto'

describe('ModulesController', () => {

    let modulesController: ModulesController
    let createModuleUsecase: CreateModuleUsecase
    let createModuleDto: CreateModuleDto

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                ModulesController
            ],
            providers: [
                {
                    provide: ModulesService,
                    useClass: ModulesServiceStub
                },
                {
                    provide: CreateModuleUsecase,
                    useClass: CreateModuleUsecaseStub
                }
            ]
        }).compile()

        modulesController = module.get<ModulesController>(ModulesController)
        createModuleUsecase = module.get<CreateModuleUsecase>(CreateModuleUsecase)

        createModuleDto = new CreateModuleDto(
            'module-id',
            'k8s-id',
            []
        )
    })

    describe('createModuleUsecase', () => {

        it('should return the correct module read dto', async () => {

            const createdAt: Date = new Date()
            const readModuleDto: ReadModuleDto = new ReadModuleDto(
                'module-id',
                [],
                createdAt,
                'k8s-id'
            )

            jest.spyOn(createModuleUsecase, 'execute')
                .mockImplementation(() => Promise.resolve(readModuleDto))

            expect(
                await modulesController.createModule(createModuleDto)
            ).toEqual(readModuleDto)
        })
    })
})
