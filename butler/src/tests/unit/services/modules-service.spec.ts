import { DeploymentsRepositoryStub, ModulesRepositoryStub } from '../../stubs/repository'
import { Repository } from 'typeorm'
import { ModuleEntity } from '../../../app/api/modules/entity'
import {  ModulesService } from '../../../app/api/deployments/services'
import { ComponentEntity } from '../../../app/api/components/entity'


describe('Module service spec', () => {
  let moduleRepository: Repository<ModuleEntity>
  let modulesService: ModulesService
  beforeEach(async() => {


    moduleRepository = new ModulesRepositoryStub() as unknown as Repository<ModuleEntity>
    modulesService = new ModulesService(moduleRepository)
  })

  it('when module doesnt have new components should not save the module again', async() => {

    const moduleEntities = [
      new ModuleEntity(
        'module-id',
        [
          new ComponentEntity('component-id')
        ])
    ]

    jest.spyOn(moduleRepository,'findOne').mockImplementation(
      () => Promise.resolve(moduleEntities[0]) )

    modulesService.createModules(moduleEntities)

    const spyModule = jest.spyOn(moduleRepository,'save')
    expect(spyModule).not.toBeCalled()
  })
})
