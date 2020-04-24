import { Test } from '@nestjs/testing'
import {
    CreateCdConfigurationUsecaseStub, DeleteCdConfigurationUsecaseStub,
    GetCdConfigurationUsecaseStub
} from '../../stubs/use-cases'
import { ConfigurationsController } from '../../../app/api/configurations/controller'
import {
    CreateCdConfigurationUsecase, DeleteCdConfigurationUsecase,
    GetCdConfigurationsUsecase
} from '../../../app/api/configurations/use-cases'
import {
    CreateCdConfigurationDto,
    ReadCdConfigurationDto
} from '../../../app/api/configurations/dto'
import { CdTypeEnum } from '../../../app/api/configurations/enums'

describe('ConfigurationsController', () => {

    let configurationsController: ConfigurationsController
    let createK8sConfigurationUsecase: CreateCdConfigurationUsecase
    let deleteCdConfigurationUsecase: DeleteCdConfigurationUsecase
    let createCdConfigurationDto: CreateCdConfigurationDto
    let getK8sConfigurationUsecase: GetCdConfigurationsUsecase

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            controllers: [
                ConfigurationsController
            ],
            providers: [
                {
                    provide: CreateCdConfigurationUsecase,
                    useClass: CreateCdConfigurationUsecaseStub
                },
                {
                    provide: GetCdConfigurationsUsecase,
                    useClass: GetCdConfigurationUsecaseStub
                },
                {
                    provide: DeleteCdConfigurationUsecase,
                    useClass: DeleteCdConfigurationUsecaseStub
                }
            ]
        }).compile()

        configurationsController = module.get<ConfigurationsController>(ConfigurationsController)
        createK8sConfigurationUsecase = module.get<CreateCdConfigurationUsecase>(CreateCdConfigurationUsecase)
        deleteCdConfigurationUsecase = module.get<DeleteCdConfigurationUsecase>(DeleteCdConfigurationUsecase)
        getK8sConfigurationUsecase = module.get<GetCdConfigurationsUsecase>(GetCdConfigurationsUsecase)

        createCdConfigurationDto = new CreateCdConfigurationDto(
            CdTypeEnum.SPINNAKER,
            { account: 'my-account', namespace: 'my-namespace' },
            'config-name',
            'authorId'
        )
    })

    describe('createK8sConfigurationUsecase', () => {

        it('should return the same readK8sConfigurationDto that the usecase', async () => {

            const creationDate: Date = new Date()
            const readK8sConfigurationDto: ReadCdConfigurationDto = new ReadCdConfigurationDto(
                'id',
                createCdConfigurationDto.name,
                createCdConfigurationDto.authorId,
                'workspaceId',
                creationDate
            )

            jest.spyOn(createK8sConfigurationUsecase, 'execute')
                .mockImplementation(() => Promise.resolve(readK8sConfigurationDto))

            expect(
                await configurationsController.createCdConfiguration(createCdConfigurationDto, 'workspaceId')
            ).toBe(readK8sConfigurationDto)
        })
    })

    describe('getK8sConfigurationsUsecase', () => {

        it('should return the same readK8sConfigurationDto array that the usecase', async () => {

            const creationDate: Date = new Date()
            const readK8sConfigurationDto: ReadCdConfigurationDto = new ReadCdConfigurationDto(
                'id',
                createCdConfigurationDto.name,
                createCdConfigurationDto.authorId,
                'workspaceId',
                creationDate
            )
            const readK8sConfigurationDtoArray: ReadCdConfigurationDto[] = [readK8sConfigurationDto, readK8sConfigurationDto]

            jest.spyOn(getK8sConfigurationUsecase, 'execute')
                .mockImplementation(() => Promise.resolve(readK8sConfigurationDtoArray))

            expect(
                await configurationsController.getCdConfigurations('workspaceId')
            ).toBe(readK8sConfigurationDtoArray)
        })
    })
})
