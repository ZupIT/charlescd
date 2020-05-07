import { Test } from '@nestjs/testing'
import { ComponentEntity } from '../../../app/api/components/entity'
import { CdConfigurationsRepository } from '../../../app/api/configurations/repository'
import {
  CircleDeploymentEntity, ComponentDeploymentEntity, DeploymentEntity, ModuleDeploymentEntity, QueuedDeploymentEntity
} from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { ComponentUndeploymentsRepository } from '../../../app/api/deployments/repository'
import { PipelineDeploymentsService, PipelineErrorHandlerService } from '../../../app/api/deployments/services'
import { IoCTokensConstants } from '../../../app/core/constants/ioc'
import { CdStrategyFactory } from '../../../app/core/integrations/cd'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { EnvConfigurationStub } from '../../stubs/configurations'
import { CdStrategyFactoryStub } from '../../stubs/integrations/cd-strategy.factory.stub'
import { CdConfigurationsRepositoryStub, ComponentsRepositoryStub, ComponentUndeploymentsRepositoryStub } from '../../stubs/repository'
import { ConsoleLoggerServiceStub, PipelineErrorHandlerServiceStub } from '../../stubs/services'
import { ModuleEntity } from '../../../app/api/modules/entity'

describe('Pipeline Deployments Service', () => {
  let pipelineDeploymentsService: PipelineDeploymentsService
  let cdStrategyFactory: CdStrategyFactory
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PipelineDeploymentsService,
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub },
        { provide: CdStrategyFactory, useClass: CdStrategyFactoryStub },
        { provide: IoCTokensConstants.ENV_CONFIGURATION, useValue: EnvConfigurationStub },
        { provide: 'ComponentEntityRepository', useClass: ComponentsRepositoryStub },
        { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
        { provide: CdConfigurationsRepository, useClass: CdConfigurationsRepositoryStub }
      ]
    }).compile()

    pipelineDeploymentsService = module.get<PipelineDeploymentsService>(PipelineDeploymentsService)
    cdStrategyFactory = module.get<CdStrategyFactory>(CdStrategyFactory)

  })

  it('triggers deployment without error', async () => {
    const moduleEntity = new ModuleEntity(
      'module-id',
      null,
      []
    )
    const componentEntity = new ComponentEntity('component-id')
    componentEntity.module = moduleEntity
    componentEntity.module.cdConfigurationId = 'cd-config-id'

    const componentDeployment = new ComponentDeploymentEntity(
      'dummy-id',
      'dummy-name',
      'dummy-img-url',
      'dummy-img-tag'
    )

    const moduleDeployment = new ModuleDeploymentEntity(
      'dummy-id',
      'helm-repository',
      [componentDeployment]
    )

    const circle = new CircleDeploymentEntity('header-value')

    const deploymentEntity = new DeploymentEntity(
      'deployment-id',
      'application-name',
      [moduleDeployment],
      'author-id',
      'description',
      'callback-url',
      circle,
      false,
      'incoming-circle-id'
    )
    moduleDeployment.deployment = deploymentEntity
    componentDeployment.moduleDeployment = moduleDeployment

    const queuedDeploymentEntity = new QueuedDeploymentEntity(
      'dummy-component-id',
      'dummy-component-deployment-id3',
      QueuedPipelineStatusEnum.QUEUED,
    )

    await expect(
      pipelineDeploymentsService.triggerCircleDeployment(componentDeployment, componentEntity, deploymentEntity, queuedDeploymentEntity, circle)
    ).resolves.not.toThrow()
  })
})
