import {Test} from '@nestjs/testing'
import {CdConfigurationsRepositoryStub} from '../../stubs/repository'
import {CdConfigurationsRepository} from '../../../app/api/configurations/repository'
import {DeleteCdConfigurationUsecase} from '../../../app/api/configurations/use-cases'
import {DeleteResult} from 'typeorm'
import {CdConfigurationEntity} from '../../../app/api/configurations/entity'
import {CdTypeEnum} from '../../../app/api/configurations/enums'
import {NotFoundException} from '@nestjs/common'

describe('DeleteCdConfigurationUsecase', () => {

    let deleteCdConfigurationUsecase: DeleteCdConfigurationUsecase
    let cdConfigurationsRepository: CdConfigurationsRepository
    let deleteResult: DeleteResult
    let cdConfiguration: CdConfigurationEntity
    let cdConfigurationId: string
    let workspaceId: string

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                DeleteCdConfigurationUsecase,
                {provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub}
            ]
        }).compile()

        cdConfigurationId = 'b801919e-9f23-41af-a446-6f829fce3910'
        workspaceId = '374c006b-8cfe-42d9-aea1-79b974c79262'
        deleteCdConfigurationUsecase = module.get<DeleteCdConfigurationUsecase>(DeleteCdConfigurationUsecase)
        cdConfigurationsRepository = module.get<CdConfigurationsRepository>(CdConfigurationsRepository)
        deleteResult = new DeleteResult()
        cdConfiguration = new CdConfigurationEntity(
            CdTypeEnum.SPINNAKER,
            {account: 'my-account', namespace: 'my-namespace'},
            'config-name',
            'authorId',
            workspaceId
        )

    })

    describe('execute', () => {
        it('should delete cd configuration accordingo to cdConfigurationId and workspaceId', async () => {

            jest.spyOn(cdConfigurationsRepository, 'findDecrypted')
                .mockImplementation(() => Promise.resolve(cdConfiguration))

            jest.spyOn(cdConfigurationsRepository, 'delete')
                .mockImplementation(() => Promise.resolve(deleteResult))

            const repositorySpy = jest.spyOn(cdConfigurationsRepository, 'delete')

            await deleteCdConfigurationUsecase.execute(cdConfigurationId, workspaceId)
            expect(repositorySpy).toHaveBeenCalledWith(cdConfigurationId)
        })
    })
})
