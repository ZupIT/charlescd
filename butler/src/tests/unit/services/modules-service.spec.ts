import { ComponentsRepositoryStub, ModulesRepositoryStub } from '../../stubs/repository'
import { Repository } from 'typeorm'
import { ModuleEntity } from '../../../app/api/modules/entity'
import {  ModulesService } from '../../../app/api/deployments/services'
import { ComponentEntity } from '../../../app/api/components/entity'


describe('Module service spec', () => {
  let moduleRepository: Repository<ModuleEntity>
  let componentRepository: Repository<ComponentEntity>
  let modulesService: ModulesService
  beforeEach(async() => {


    moduleRepository = new ModulesRepositoryStub() as unknown as Repository<ModuleEntity>
    componentRepository = new ComponentsRepositoryStub() as unknown as Repository<ComponentEntity>
    modulesService = new ModulesService(moduleRepository,componentRepository)
  })

  it('when module doesnt have new components should not save the module or components ', async() => {

    const moduleEntities = [
      new ModuleEntity(
        'module-id',
        [
          new ComponentEntity('component-id')
        ])
    ]

    jest.spyOn(moduleRepository,'findOne').mockImplementation(
      () => Promise.resolve(moduleEntities[0]) )

    const spyModule = jest.spyOn(moduleRepository,'save')
    const spyComponent = jest.spyOn(componentRepository,'save')

    await modulesService.createModules(moduleEntities)
    expect(spyModule).not.toBeCalled()
    expect(spyComponent).not.toBeCalled()
  })
  it('when module  have new components should save that new component', async() => {

    const moduleEntities = [
      new ModuleEntity(
        'module-id',
        [
          new ComponentEntity('component-id')
        ])
    ]
    const moduleEntitiesUpdated = [
      new ModuleEntity('moduleId-2',[
        new ComponentEntity('component-id'),
        new ComponentEntity('component-id-2')
      ])
    ]
    jest.spyOn(moduleRepository,'findOne').mockImplementation(
      () => Promise.resolve(moduleEntities[0]) )

    const spyComponent = jest.spyOn(componentRepository,'save')

    await modulesService.createModules(moduleEntitiesUpdated)
    expect(spyComponent).toBeCalled()
  })
})
