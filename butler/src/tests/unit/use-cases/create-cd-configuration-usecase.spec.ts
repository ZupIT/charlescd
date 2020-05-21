import { Test } from '@nestjs/testing'
import { CdConfigurationsRepositoryStub } from '../../stubs/repository'
import { CreateCdConfigurationUsecase } from '../../../app/api/configurations/use-cases'
import { CdConfigurationsRepository } from '../../../app/api/configurations/repository'
import { CdConfigurationEntity } from '../../../app/api/configurations/entity'
import { CreateCdConfigurationDto } from '../../../app/api/configurations/dto'
import { CdTypeEnum } from '../../../app/api/configurations/enums'

describe('CreateCdConfigurationUsecase', () => {

    let createCdConfigurationUsecase: CreateCdConfigurationUsecase
    let cdConfigurationsRepository: CdConfigurationsRepository
    let cdConfiguration: CdConfigurationEntity
    let createCdConfigurationDto: CreateCdConfigurationDto

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateCdConfigurationUsecase,
                { provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub }
            ]
        }).compile()

        createCdConfigurationUsecase = module.get<CreateCdConfigurationUsecase>(CreateCdConfigurationUsecase)
        cdConfigurationsRepository = module.get<CdConfigurationsRepository>(CdConfigurationsRepository)

        createCdConfigurationDto = new CreateCdConfigurationDto(
            CdTypeEnum.SPINNAKER,
            { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
            'config-name',
            'authorId'
        )

        cdConfiguration = new CdConfigurationEntity(
            CdTypeEnum.SPINNAKER,
            { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
            'config-name',
            'authorId',
            'applicationId'
        )
    })

    describe('execute', () => {
        it('should return the correct read dto for a given entity', async () => {

            jest.spyOn(cdConfigurationsRepository, 'saveEncrypted')
                .mockImplementation(() => Promise.resolve(cdConfiguration))

            expect(await createCdConfigurationUsecase.execute(createCdConfigurationDto, 'applicationId'))
                .toEqual(cdConfiguration.toReadDto())
        })
    })
})
