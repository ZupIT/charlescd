import { Test } from '@nestjs/testing'
import { SpinnakerService } from '../../../app/core/integrations/cd/spinnaker'
import {
  ConsoleLoggerServiceStub,
  HttpServiceStub,
  MooveServiceStub,
  PipelineErrorHandlerServiceStub,
  PipelineQueuesServiceStub,
  StatusManagementServiceStub
} from '../../stubs/services'
import { EnvConfigurationStub } from '../../stubs/configurations'
import { StatusManagementService } from '../../../app/core/services/deployments'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'
import { MooveService } from '../../../app/core/integrations/moove'
import {
  PipelineErrorHandlerService,
  PipelineQueuesService
} from '../../../app/api/deployments/services'
import {
  ComponentDeploymentsRepository,
  ComponentUndeploymentsRepository,
  QueuedDeploymentsRepository
} from '../../../app/api/deployments/repository'
import {
  ComponentDeploymentsRepositoryStub,
  ComponentUndeploymentsRepositoryStub,
  DeploymentsRepositoryStub,
  QueuedDeploymentsRepositoryStub
} from '../../stubs/repository'
import { HttpService } from '@nestjs/common'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import { IDeploymentConfiguration } from '../../../app/core/integrations/configuration/interfaces'
import { Repository } from 'typeorm'
import {
  CircleDeploymentEntity,
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  ModuleUndeploymentEntity,
  QueuedDeploymentEntity,
  QueuedUndeploymentEntity,
  UndeploymentEntity
} from '../../../app/api/deployments/entity'
import { QueuedPipelineStatusEnum } from '../../../app/api/deployments/enums'
import { IoCTokensConstants } from '../../../app/core/constants/ioc'

describe('Spinnaker Service', () => {
  let spinnakerService: SpinnakerService
  let httpService: HttpService
  let defaultAxiosGetResponse: AxiosResponse
  let defaultAxiosPostResponse: AxiosResponse
  let pipelineOptions: IPipelineOptions
  let deploymentConfiguration: IDeploymentConfiguration
  let deploymentsRepository: Repository<DeploymentEntity>
  let deployment: DeploymentEntity
  let circle: CircleDeploymentEntity
  let statusManagementService: StatusManagementService
  let mooveService: MooveService
  let pipelineQueuesService: PipelineQueuesService
  let queuedDeploymentsRepository: QueuedDeploymentsRepository
  let queuedDeployment: QueuedDeploymentEntity
  let undeploymentComponentDeployments: ComponentDeploymentEntity[]
  let undeploymentModuleDeployments: ModuleDeploymentEntity[]
  let undeploymentDeployment: DeploymentEntity
  let undeployment: UndeploymentEntity
  let queuedUndeployments: QueuedUndeploymentEntity[]
  let componentUndeploymentsRepository: ComponentUndeploymentsRepository
  let componentUndeployment: ComponentUndeploymentEntity
  let moduleUndeployment: ModuleUndeploymentEntity
  let pipelineErrorHandlerService: PipelineErrorHandlerService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SpinnakerService,
        { provide: HttpService, useClass: HttpServiceStub },
        { provide: StatusManagementService, useClass: StatusManagementServiceStub },
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: IoCTokensConstants.ENV_CONFIGURATION, useValue: EnvConfigurationStub },
        { provide: 'DeploymentEntityRepository', useClass: DeploymentsRepositoryStub },
        { provide: MooveService, useClass: MooveServiceStub },
        { provide: PipelineQueuesService, useClass: PipelineQueuesServiceStub },
        { provide: QueuedDeploymentsRepository, useClass: QueuedDeploymentsRepositoryStub },
        { provide: ComponentUndeploymentsRepository, useClass: ComponentUndeploymentsRepositoryStub },
        { provide: ComponentDeploymentsRepository, useClass: ComponentDeploymentsRepositoryStub },
        { provide: PipelineErrorHandlerService, useClass: PipelineErrorHandlerServiceStub }
      ]
    }).compile()

    spinnakerService = module.get<SpinnakerService>(SpinnakerService)
    httpService = module.get<HttpService>(HttpService)
    deploymentsRepository = module.get<Repository<DeploymentEntity>>('DeploymentEntityRepository')
    statusManagementService = module.get<StatusManagementService>(StatusManagementService)
    mooveService = module.get<MooveService>(MooveService)
    pipelineQueuesService = module.get<PipelineQueuesService>(PipelineQueuesService)
    queuedDeploymentsRepository = module.get<QueuedDeploymentsRepository>(QueuedDeploymentsRepository)
    componentUndeploymentsRepository = module.get<ComponentUndeploymentsRepository>(ComponentUndeploymentsRepository)
    pipelineErrorHandlerService = module.get<PipelineErrorHandlerService>(PipelineErrorHandlerService)

    defaultAxiosGetResponse = {
      data: {
        id: 'some-pipeline-id',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }

    defaultAxiosPostResponse = {
      data: {
        id: 'some-pipeline-id',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }

    pipelineOptions = { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }

    deploymentConfiguration = {
      account: 'some-account',
      pipelineName: 'some-pipeline-name',
      applicationName: 'some-application-name',
      appName: 'some-app-name',
      appNamespace: 'some-app-namespace',
      healthCheckPath: '/health',
      uri: { uriName: 'https://some.uri' },
      appPort: 8989
    }

    circle = new CircleDeploymentEntity('dummy-circle')

    deployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        null,
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        circle,
        false,
        'dummy-circle-id'
    )

    queuedDeployment = new QueuedDeploymentEntity(
        'dummy-component-id',
        'dummy-component-deployment-id3',
        QueuedPipelineStatusEnum.QUEUED,
    )

    undeploymentComponentDeployments = [
      new ComponentDeploymentEntity(
          'dummy-id',
          'dummy-name',
          'dummy-img-url',
          'dummy-img-tag',
          'dummy-context-path',
          'dummy-health-check',
          1000
      ),
      new ComponentDeploymentEntity(
          'dummy-id',
          'dummy-name2',
          'dummy-img-url2',
          'dummy-img-tag2',
          'dummy-context-path2',
          'dummy-health-check2',
          1001
      )
    ]

    undeploymentModuleDeployments = [
      new ModuleDeploymentEntity(
          'dummy-id',
          'helm-repository',
          undeploymentComponentDeployments
      )
    ]

    queuedUndeployments = [
      new QueuedUndeploymentEntity(
          'dummy-id',
          undeploymentComponentDeployments[0].id,
          QueuedPipelineStatusEnum.QUEUED,
          'dummy-id-2'
      ),
      new QueuedUndeploymentEntity(
          'dummy-id',
          undeploymentComponentDeployments[1].id,
          QueuedPipelineStatusEnum.QUEUED,
          'dummy-id-3'
      )
    ]
    queuedUndeployments[0].id = 200
    queuedUndeployments[1].id = 201

    undeploymentDeployment = new DeploymentEntity(
        'dummy-deployment-id',
        'dummy-application-name',
        undeploymentModuleDeployments,
        'dummy-author-id',
        'dummy-description',
        'dummy-callback-url',
        null,
        false,
        'dummy-circle-id'
    )

    undeployment = new UndeploymentEntity(
        'dummy-author-id',
      undeploymentDeployment,
        'dummy-circle-id'
    )

    moduleUndeployment = new ModuleUndeploymentEntity(
        undeploymentModuleDeployments[0],
        null
    )
    moduleUndeployment.undeployment = undeployment

    componentUndeployment = new ComponentUndeploymentEntity(
        undeploymentComponentDeployments[0]
    )
    componentUndeployment.moduleUndeployment = moduleUndeployment
  })

  describe('deploySpinnakerPipeline', () => {

    it('should call spinnaker api with application name and module name', async () => {
      jest.spyOn(httpService, 'post')
          .mockImplementation(() => of(defaultAxiosPostResponse))

      const httpPostSpy = jest.spyOn(httpService, 'post')

      await spinnakerService.deploySpinnakerPipeline(
          'some-pipeline-name',
          'some-application-name'
      )

      expect(httpPostSpy).nthCalledWith(
          1,
          'spinnakerurl.com/pipelines/some-application-name/some-pipeline-name',
          {},
          { headers: { 'Content-Type': 'application/json' } }
      )
    })

    it('should handle spinnaker deployment api call failure correctly', async () => {
      jest.spyOn(httpService, 'post')
          .mockImplementation(() => { throw new Error() })

      jest.spyOn(deploymentsRepository, 'findOne')
          .mockImplementation(() => Promise.resolve(deployment))

      jest.spyOn(queuedDeploymentsRepository, 'findOne')
          .mockImplementation(() => Promise.resolve(queuedDeployment))

      const deploymentErrorSpy = jest.spyOn(pipelineErrorHandlerService, 'handleDeploymentFailure')
      const componentErrorSpy = jest.spyOn(pipelineErrorHandlerService, 'handleComponentDeploymentFailure')

      await spinnakerService.deploySpinnakerPipeline(
          'some-pipeline-name',
          'some-application-name'
      )

      expect(deploymentErrorSpy).toHaveBeenCalled()
      expect(componentErrorSpy).toHaveBeenCalled()
    })

    it('should handle spinnaker undeployment api call failure correctly', async () => {
      jest.spyOn(httpService, 'post')
          .mockImplementation(() => { throw new Error() })

      jest.spyOn(componentUndeploymentsRepository, 'getOneWithRelations')
          .mockImplementation(() => Promise.resolve(componentUndeployment))

      jest.spyOn(queuedDeploymentsRepository, 'findOne')
          .mockImplementation(() => Promise.resolve(queuedUndeployments[0]))

      const undeploymentErrorSpy = jest.spyOn(pipelineErrorHandlerService, 'handleUndeploymentFailure')
      const componentErrorSpy = jest.spyOn(pipelineErrorHandlerService, 'handleComponentUndeploymentFailure')

      await spinnakerService.deploySpinnakerPipeline(
          'some-pipeline-name',
          'some-application-name'
      )

      expect(undeploymentErrorSpy).toHaveBeenCalled()
      expect(componentErrorSpy).toHaveBeenCalled()
    })
  })
})
