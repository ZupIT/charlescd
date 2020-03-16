import { Test } from '@nestjs/testing'
import { K8sConfigurationsRepositoryStub } from '../../stubs/repository'
import { CreateK8sConfigurationUsecase } from '../../../app/api/configurations/use-cases'
import { CdConfigurationsRepository } from '../../../app/api/configurations/repository'
import {
    CdConfigurationDataEntity,
    CdConfigurationEntity
} from '../../../app/api/configurations/entity'
import { CreateCdConfigurationDto } from '../../../app/api/configurations/dto'

describe('CreateK8sConfigurationUsecase', () => {

    let createK8sConfigurationUsecase: CreateK8sConfigurationUsecase
    let k8sConfigurationsRepository: CdConfigurationsRepository
    let k8sConfiguration: CdConfigurationEntity
    let createK8sConfigurationDto: CreateCdConfigurationDto

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateK8sConfigurationUsecase,
                { provide: CdConfigurationsRepository, useClass: K8sConfigurationsRepositoryStub }
            ]
        }).compile()

        createK8sConfigurationUsecase = module.get<CreateK8sConfigurationUsecase>(CreateK8sConfigurationUsecase)
        k8sConfigurationsRepository = module.get<CdConfigurationsRepository>(CdConfigurationsRepository)

        createK8sConfigurationDto = new CreateCdConfigurationDto(
            'name',
            'account',
            'namespace',
            'authorId'
        )

        k8sConfiguration = new CdConfigurationEntity(
            'name',
            undefined,
            'authorId',
            'applicationId',
        )
    })

    describe('execute', () => {
        it('should return the correct read dto for a given entity', async () => {

            jest.spyOn(k8sConfigurationsRepository, 'saveEncrypted')
                .mockImplementation(() => Promise.resolve(k8sConfiguration))

            expect(await createK8sConfigurationUsecase.execute(createK8sConfigurationDto, 'applicationId'))
                .toEqual(k8sConfiguration)
        })
    })
})
