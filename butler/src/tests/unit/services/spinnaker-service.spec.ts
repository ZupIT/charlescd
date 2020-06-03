/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import {
  ComponentDeploymentEntity,
  ComponentUndeploymentEntity,
  DeploymentEntity,
  ModuleDeploymentEntity,
  ModuleUndeploymentEntity,
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
  let pipelineOptions: IPipelineOptions
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

    pipelineOptions = { pipelineCircles: [], pipelineVersions: [], pipelineUnusedVersions: [] }

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
      'dummy-circle-id',
      'cd-configuration-id'
    )

    undeployment = new UndeploymentEntity(
      'dummy-author-id',
      undeploymentDeployment,
      'dummy-circle-id'
    )

    componentUndeployment = new ComponentUndeploymentEntity(
      undeploymentComponentDeployments[0]
    )

    moduleUndeployment = new ModuleUndeploymentEntity(
      undeploymentModuleDeployments[0],
      [componentUndeployment]
    )
    moduleUndeployment.undeployment = undeployment

    componentUndeployment.moduleUndeployment = moduleUndeployment

    connectorConfiguration = {
      pipelineCirclesOptions: pipelineOptions,
      cdConfiguration: { gitAccount: 'git-account', account: 'k8s-account', namespace: 'k8s-namespace', url: 'k8s.url.com' } as ICdConfigurationData,
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
