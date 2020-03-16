import { Test } from '@nestjs/testing'
import {
    CreateK8sConfigurationUsecaseStub,
    GetK8sConfigurationUsecaseStub
} from '../../stubs/use-cases'
import { ConfigurationsController } from '../../../app/api/configurations/controller'
import {
    CreateK8sConfigurationUsecase,
    GetK8sConfigurationsUsecase
} from '../../../app/api/configurations/use-cases'
import {
    CreateCdConfigurationDto,
    ReadCdConfigurationDto
} from '../../../app/api/configurations/dto'

describe('ConfigurationsController', () => {

    let configurationsController: ConfigurationsController
    let createK8sConfigurationUsecase: CreateK8sConfigurationUsecase
    let createK8sConfigurationDto: CreateCdConfigurationDto
    let getK8sConfigurationUsecase: GetK8sConfigurationsUsecase

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                ConfigurationsController
            ],
            providers: [
                {
                    provide: CreateK8sConfigurationUsecase,
                    useClass: CreateK8sConfigurationUsecaseStub
                },
                {
                    provide: GetK8sConfigurationsUsecase,
                    useClass: GetK8sConfigurationUsecaseStub
                }
            ]
        }).compile()

        configurationsController = module.get<ConfigurationsController>(ConfigurationsController)
        createK8sConfigurationUsecase = module.get<CreateK8sConfigurationUsecase>(CreateK8sConfigurationUsecase)
        getK8sConfigurationUsecase = module.get<GetK8sConfigurationsUsecase>(GetK8sConfigurationsUsecase)

        createK8sConfigurationDto = new CreateCdConfigurationDto(
            'name',
            'account',
            'namespace',
            'authorId'
        )
    })

    describe('createK8sConfigurationUsecase', () => {

        it('should return the same readK8sConfigurationDto that the usecase', async () => {

            const creationDate: Date = new Date()
            const readK8sConfigurationDto: ReadCdConfigurationDto = new ReadCdConfigurationDto(
                'id',
                createK8sConfigurationDto.name,
                createK8sConfigurationDto.authorId,
                'applicationId',
                creationDate
            )

            jest.spyOn(createK8sConfigurationUsecase, 'execute')
                .mockImplementation(() => Promise.resolve(readK8sConfigurationDto))

            expect(
                await configurationsController.createK8sConfiguration(createK8sConfigurationDto, 'applicationId')
            ).toBe(readK8sConfigurationDto)
        })
    })

    describe('getK8sConfigurationsUsecase', () => {

        it('should return the same readK8sConfigurationDto array that the usecase', async () => {

            const creationDate: Date = new Date()
            const readK8sConfigurationDto: ReadCdConfigurationDto = new ReadCdConfigurationDto(
                'id',
                createK8sConfigurationDto.name,
                createK8sConfigurationDto.authorId,
                'applicationId',
                creationDate
            )
            const readK8sConfigurationDtoArray: ReadCdConfigurationDto[] = [readK8sConfigurationDto, readK8sConfigurationDto]

            jest.spyOn(getK8sConfigurationUsecase, 'execute')
                .mockImplementation(() => Promise.resolve(readK8sConfigurationDtoArray))

            expect(
                await configurationsController.getK8sConfigurations('applicationId')
            ).toBe(readK8sConfigurationDtoArray)
        })
    })
})
