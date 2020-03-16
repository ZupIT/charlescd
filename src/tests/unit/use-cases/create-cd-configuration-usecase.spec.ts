import { Test } from '@nestjs/testing'
import { CdConfigurationsRepositoryStub } from '../../stubs/repository'
import { CreateCdConfigurationUsecase } from '../../../app/api/configurations/use-cases'
import { CdConfigurationsRepository } from '../../../app/api/configurations/repository'
import { CdConfigurationEntity } from '../../../app/api/configurations/entity'
import { CreateCdConfigurationDto } from '../../../app/api/configurations/dto'

describe('CreateCdConfigurationUsecase', () => {

    let createCdConfigurationUsecase: CreateCdConfigurationUsecase
    let cdConfigurationsRepository: CdConfigurationsRepository
    let cdConfiguration: CdConfigurationEntity
    let createK8sConfigurationDto: CreateCdConfigurationDto

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateCdConfigurationUsecase,
                { provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub }
            ]
        }).compile()

        createCdConfigurationUsecase = module.get<CreateCdConfigurationUsecase>(CreateCdConfigurationUsecase)
        cdConfigurationsRepository = module.get<CdConfigurationsRepository>(CdConfigurationsRepository)

        createK8sConfigurationDto = new CreateCdConfigurationDto(
            'name',
            'account',
            'namespace',
            'authorId'
        )

        cdConfiguration = new CdConfigurationEntity(
            'name',
            undefined,
            'authorId',
            'applicationId',
        )
    })

    describe('execute', () => {
        it('should return the correct read dto for a given entity', async () => {

            jest.spyOn(cdConfigurationsRepository, 'saveEncrypted')
                .mockImplementation(() => Promise.resolve(cdConfiguration))

            expect(await createCdConfigurationUsecase.execute(createK8sConfigurationDto, 'applicationId'))
                .toEqual(cdConfiguration)
        })
    })
})
