import { Test } from '@nestjs/testing'
import { K8sConfigurationsRepositoryStub } from '../../stubs/repository'
import { CreateK8sConfigurationUsecase } from '../../../app/api/configurations/use-cases'
import { K8sConfigurationsRepository } from '../../../app/api/configurations/repository'
import {
    K8sConfigurationDataEntity,
    K8sConfigurationEntity
} from '../../../app/api/configurations/entity'
import { CreateK8sConfigurationDto } from '../../../app/api/configurations/dto'

describe('CreateK8sConfigurationUsecase', () => {

    let createK8sConfigurationUsecase: CreateK8sConfigurationUsecase
    let k8sConfigurationsRepository: K8sConfigurationsRepository
    let k8sConfiguration: K8sConfigurationEntity
    let createK8sConfigurationDto: CreateK8sConfigurationDto

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                CreateK8sConfigurationUsecase,
                { provide: K8sConfigurationsRepository, useClass: K8sConfigurationsRepositoryStub }
            ]
        }).compile()

        createK8sConfigurationUsecase = module.get<CreateK8sConfigurationUsecase>(CreateK8sConfigurationUsecase)
        k8sConfigurationsRepository = module.get<K8sConfigurationsRepository>(K8sConfigurationsRepository)

        createK8sConfigurationDto = new CreateK8sConfigurationDto(
            'name',
            'account',
            'namespace',
            'authorId'
        )

        k8sConfiguration = new K8sConfigurationEntity(
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
