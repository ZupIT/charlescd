import { Test } from '@nestjs/testing'
import { DeploymentConfigurationService } from '../../../../src/app/core/integrations/configuration'
import { MooveService } from '../../../../src/app/core/integrations/moove'
import { HttpService, Module } from '@nestjs/common'
import { ConsoleLoggerService } from '../../../../src/app/core/logs/console'
import { ConsulConfigurationStub } from '../../../../src/tests/stubs/configurations'
import { ComponentDeploymentsRepositoryStub } from '../../../../src/tests/stubs/repository'
import { ComponentDeploymentsRepository } from '../../../../src/app/api/deployments/repository'
import {
  DeploymentEntity,
  ModuleDeploymentEntity,
  ComponentDeploymentEntity,
  CircleDeploymentEntity
} from '../../../../src/app/api/deployments/entity'

describe('Deployment configuration specs', () => {
  let componentDeploymentsRepository: ComponentDeploymentsRepository
  let deployment: DeploymentEntity
  let moduleDeploymentEntity: ModuleDeploymentEntity
  let componentsDeploymentEntity: ComponentDeploymentEntity
  let circleEntity: CircleDeploymentEntity

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
      ]
    }).compile()
    componentDeploymentsRepository = module.get<ComponentDeploymentsRepository>(ComponentDeploymentsRepository)

    componentsDeploymentEntity = new ComponentDeploymentEntity(
      'component-id',
      'component name',
      'http://image.url',
      'image-tag',
      'context-path',
      'http://health.check',
      8787
    )

    moduleDeploymentEntity = new ModuleDeploymentEntity('module-id', 'konfig-id', [componentsDeploymentEntity])
    deployment = new DeploymentEntity(
      'deployment-id',
      'value-flow-uid',
      [moduleDeploymentEntity],
      'author-id',
      'some description',
      'http://callback.url',
      circleEntity,
      true,
      'circle-id'
    )
    moduleDeploymentEntity.deployment = deployment
    componentsDeploymentEntity.moduleDeployment = moduleDeploymentEntity

  })
  it('should correctly prefix the flow id', async () => {
    const httpService: HttpService = new HttpService()
    const consoleLoggerService: ConsoleLoggerService = new ConsoleLoggerService()
    const mooveService: MooveService = new MooveService(httpService, consoleLoggerService, ConsulConfigurationStub)

    const deploymentConfigurationService: DeploymentConfigurationService = new DeploymentConfigurationService(
      mooveService, componentDeploymentsRepository
    )

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
        applicationName: 'app-value-flow-uid',
        healthCheckPath: 'http://health.check',
        pipelineName: 'component-id', uri: { uriName: 'context-path' }
      }
    )
  })
})
