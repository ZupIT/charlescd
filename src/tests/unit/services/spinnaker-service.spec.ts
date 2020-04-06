import { Test } from '@nestjs/testing'
import { SpinnakerService } from '../../../app/core/integrations/cd/spinnaker'
import {
  ConsoleLoggerServiceStub,
  HttpServiceStub,
  SpinnakerApiServiceStub
} from '../../stubs/services'
import { EnvConfigurationStub } from '../../stubs/configurations'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { AxiosResponse } from 'axios'
import { HttpService } from '@nestjs/common'
import { IPipelineOptions } from '../../../app/api/components/interfaces'
import { IDeploymentConfiguration } from '../../../app/core/integrations/configuration/interfaces'
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
import { SpinnakerApiService } from '../../../app/core/integrations/cd/spinnaker/spinnaker-api.service'
import { of } from 'rxjs'
import { IConnectorConfiguration } from '../../../app/core/integrations/cd/interfaces'
import { ICdConfigurationData } from '../../../app/api/configurations/interfaces'

describe('Spinnaker Service', () => {
  let spinnakerService: SpinnakerService
  let spinnakerApiService: SpinnakerApiService
  let defaultAxiosGetResponse: AxiosResponse
  let defaultAxiosPostResponse: AxiosResponse
  let pipelineOptions: IPipelineOptions
  let deploymentConfiguration: IDeploymentConfiguration
  let deployment: DeploymentEntity
  let circle: CircleDeploymentEntity
  let queuedDeployment: QueuedDeploymentEntity
  let undeploymentComponentDeployments: ComponentDeploymentEntity[]
  let undeploymentModuleDeployments: ModuleDeploymentEntity[]
  let undeploymentDeployment: DeploymentEntity
  let undeployment: UndeploymentEntity
  let queuedUndeployments: QueuedUndeploymentEntity[]
  let componentUndeployment: ComponentUndeploymentEntity
  let moduleUndeployment: ModuleUndeploymentEntity
  let connectorConfiguration: IConnectorConfiguration

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SpinnakerService,
        { provide: HttpService, useClass: HttpServiceStub },
        { provide: ConsoleLoggerService, useClass: ConsoleLoggerServiceStub },
        { provide: IoCTokensConstants.ENV_CONFIGURATION, useValue: EnvConfigurationStub },
        { provide: SpinnakerApiService, useClass: SpinnakerApiServiceStub }
      ]
    }).compile()

    spinnakerService = module.get<SpinnakerService>(SpinnakerService)
    spinnakerApiService = module.get<SpinnakerApiService>(SpinnakerApiService)

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
      appNamespace: 'some-app-namespace'
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
          'dummy-img-tag'
      ),
      new ComponentDeploymentEntity(
          'dummy-id',
          'dummy-name2',
          'dummy-img-url2',
          'dummy-img-tag2'
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

    connectorConfiguration = {
      pipelineCirclesOptions: pipelineOptions,
      cdConfiguration: { namespace: 'some-app-namespace', gitUsername: 'git-user', gitPassword: 'git-password' } as ICdConfigurationData,
      componentId: 'component-id',
      applicationName: 'application-name',
      componentName: 'component-name',
      helmRepository: '',
      callbackCircleId: 'circle-id',
      pipelineCallbackUrl: 'dummy-callback-url'
    }
  })

  it('should handle on spinnaker deployment failure', async () => {
    jest.spyOn(spinnakerApiService, 'getApplication')
        .mockImplementation(() => of({} as AxiosResponse))
    jest.spyOn(spinnakerApiService, 'getPipeline')
        .mockImplementation(() => of({} as AxiosResponse))
    jest.spyOn(spinnakerApiService, 'createPipeline')
        .mockImplementation(() => of({} as AxiosResponse))
    jest.spyOn(spinnakerApiService, 'deployPipeline')
        .mockImplementation(() => { throw new Error('bad request') })

    await expect(spinnakerService.createDeployment(connectorConfiguration)).rejects.toThrow()
  })
})
