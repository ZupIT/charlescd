import { Test } from '@nestjs/testing'
import { DeploymentConfigurationService } from '../../../app/core/integrations/configuration'
import { MooveService } from '../../../app/core/integrations/moove'
import { ComponentDeploymentsRepositoryStub } from '../../stubs/repository'
import { ComponentDeploymentsRepository } from '../../../app/api/deployments/repository'
import {
  ComponentDeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity
} from '../../../app/api/deployments/entity'
import { MooveServiceStub } from '../../stubs/services'

describe('Deployment configuration specs', () => {
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let deployment: DeploymentEntity
  let moduleDeploymentEntity: ModuleDeploymentEntity
  let componentsDeploymentEntity: ComponentDeploymentEntity
  let mooveService: MooveService
  let deploymentConfigurationService: DeploymentConfigurationService

  beforeEach(async () => {

    const module = await Test.createTestingModule({
      providers: [
        DeploymentConfigurationService,
        { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
        { provide: MooveService, useClass: MooveServiceStub }
      ]
    }).compile()

    deploymentConfigurationService = module.get<DeploymentConfigurationService>(DeploymentConfigurationService)
    componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)
    mooveService = module.get<MooveService>(MooveService)

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
        'config-id',
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
  })

  it('should correctly prefix the flow id', async () => {
    const expectedApplicationName: string = 'app-value-flow-uid'

    jest.spyOn(componentDeploymentsRepository, 'getOneWithRelations')
      .mockImplementation(() => Promise.resolve(componentsDeploymentEntity))
    jest.spyOn(mooveService, 'getK8sConfiguration')
      .mockImplementation(() => Promise.resolve({ namespace: 'some-namespace', account: 'some-account' }))

    expect(await deploymentConfigurationService.getConfiguration('some-id')).toEqual(
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
