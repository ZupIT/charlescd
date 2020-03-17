import { Test } from '@nestjs/testing'
import { DeploymentConfigurationService } from '../../../app/core/integrations/configuration'
import {
  CdConfigurationsRepositoryStub,
  ComponentDeploymentsRepositoryStub
} from '../../stubs/repository'
import { ComponentDeploymentsRepository } from '../../../app/api/deployments/repository'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../../app/api/deployments/entity'
import { CdConfigurationsRepository } from '../../../app/api/configurations/repository'
import { ICdConfigurationData } from '../../../app/api/configurations/interfaces'

describe('Deployment configuration specs', () => {
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let deployment: DeploymentEntity
  let moduleDeploymentEntity: ModuleDeploymentEntity
  let componentsDeploymentEntity: ComponentDeploymentEntity
  let deploymentConfigurationService: DeploymentConfigurationService
  let cdConfigurationsRepository: CdConfigurationsRepository
  let cdConfigurationData: ICdConfigurationData

  beforeEach(async () => {

    const module = await Test.createTestingModule({
      providers: [
        DeploymentConfigurationService,
        { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
        { provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub }
      ]
    }).compile()

    deploymentConfigurationService = module.get<DeploymentConfigurationService>(DeploymentConfigurationService)
    componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
    cdConfigurationsRepository = module.get<CdConfigurationsRepository>(CdConfigurationsRepository)

    componentsDeploymentEntity = new ComponentDeploymentEntity(
      'component-id',
      'component name',
      'http://image.url',
      'image-tag',
      'context-path',
      'http://health.check',
      8787
    )

    moduleDeploymentEntity = new ModuleDeploymentEntity(
        'module-id',
        'helm-repository',
        [componentsDeploymentEntity]
    )

    deployment = new DeploymentEntity(
      'deployment-id',
      'value-flow-uid',
      [moduleDeploymentEntity],
      'author-id',
      'some description',
      'http://callback.url',
      null,
      true,
      'circle-id'
    )
    moduleDeploymentEntity.deployment = deployment
    componentsDeploymentEntity.moduleDeployment = moduleDeploymentEntity

    cdConfigurationData = {
        account: 'some-account',
        namespace: 'some-namespace'
    }
  })

  it('should correctly prefix the flow id', async () => {
    const expectedApplicationName: string = 'app-value-flow-uid'

    jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
      .mockImplementation(() => Promise.resolve(componentsDeploymentEntity))
    jest.spyOn(cdConfigurationsRepository, 'findDecrypted')
      .mockImplementation(() => Promise.resolve(cdConfigurationData))

    expect(await deploymentConfigurationService.getConfiguration('some-id', 'module-id')).toEqual(
      {
        account: 'some-account',
        appName: 'component name',
        appNamespace: 'some-namespace',
        appPort: 8787,
        applicationName: expectedApplicationName,
        healthCheckPath: 'http://health.check',
        pipelineName: 'component-id', uri: { uriName: 'context-path' }
      }
    )
  })
})
