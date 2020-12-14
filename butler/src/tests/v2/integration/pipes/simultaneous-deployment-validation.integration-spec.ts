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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v2/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums/cd-type.enum'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'
import { CreateCircleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-circle-request.dto'
import { CreateComponentRequestDto } from '../../../../app/v2/api/deployments/dto/create-component-request.dto'
import { CreateDeploymentRequestDto } from '../../../../app/v2/api/deployments/dto/create-deployment-request.dto'
import { CreateModuleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-module-request.dto'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { SimultaneousDeploymentValidationPipe } from '../../../../app/v2/api/deployments/pipes'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'

describe('DeploymentCleanupHandler', () => {
  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let pipe: SimultaneousDeploymentValidationPipe
  let manager: EntityManager
  beforeAll(async() => {
    const module = Test.createTestingModule({
      imports: [
        await AppModule.forRootAsync()
      ],
      providers: [
        FixtureUtilsService
      ]
    })
    app = await TestSetupUtils.createApplication(module)
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    pipe = app.get<SimultaneousDeploymentValidationPipe>(SimultaneousDeploymentValidationPipe)
    manager = fixtureUtilsService.connection.manager
    TestSetupUtils.seApplicationConstants()
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('does not allow simultaneous deployment on a circle when there is already an execution with status CREATED for it', async() => {
    const circleId = '333365f8-bb29-49f7-bf2b-3ec956a71583'
    const componentName = 'component-name'
    const defaultCircle = false
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: circleId,
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: componentName
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af',
      defaultCircle: defaultCircle
    }

    await createDeploymentAndExecution(params, fixtureUtilsService, manager, DeploymentStatusEnum.CREATED)
    const createDeploymentDto = createDto(componentName, circleId, defaultCircle)
    const execution = await manager.findOneOrFail(Execution)

    await expect(
      pipe.transform(createDeploymentDto)
    ).rejects.toThrow(new BadRequestException(`Simultaneous deployments are not allowed for a given circle. The following executions are not finished: ${execution.id}`))

  })

  it('does not allow simultaneous deployment on a default circle when there is already an execution with status CREATED for it', async() => {
    const circleId = 'ac137b62-37b6-4e76-b474-9c43bac00711'
    const componentName = 'component-name'
    const defaultCircle = true
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: circleId,
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: componentName
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af',
      defaultCircle: defaultCircle
    }

    await createDeploymentAndExecution(params, fixtureUtilsService, manager, DeploymentStatusEnum.CREATED)
    const createDeploymentDto = createDto(componentName, circleId, defaultCircle)
    const execution = await manager.findOneOrFail(Execution)
    await expect(
      pipe.transform(createDeploymentDto)
    ).rejects.toThrow(new BadRequestException(`Simultaneous deployments are not allowed for a given circle. The following executions are not finished: ${execution.id}`))
  })

  it('should allow a simultaneous deployment on a default circle when there is an execution with status CREATED for another default circle', async() => {
    const componentName = 'component-name'
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '3eb609b0-829c-4861-8fc3-856197e1b85b',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: componentName
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:9000/deploy/notifications/deployment',
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af',
      defaultCircle: true
    }

    await createDeploymentAndExecution(params, fixtureUtilsService, manager, DeploymentStatusEnum.CREATED)
    const createDeploymentDto = createDto(componentName, '5d1fc2bd-1275-458b-bf54-71727f8cb33b', true)
    await expect(
      pipe.transform(createDeploymentDto)
    ).resolves.toEqual(createDeploymentDto)
  })

  const createDto = (componentName: string, circleId: string, defaultCircle: boolean) => {
    const components = new CreateComponentRequestDto(
      '777765f8-bb29-49f7-bf2b-3ec956a71583',
      'image.url',
      'imageTag',
      componentName,
      undefined,
      undefined
    )

    const modules = new CreateModuleDeploymentDto(
      'acf45587-3684-476a-8e6f-b479820a8cd5',
      'https://some-helm.repo',
      [components]
    )

    const circle = new CreateCircleDeploymentDto(circleId)

    const createDeploymentDto = new CreateDeploymentRequestDto(
      '28a3f957-3702-4c4e-8d92-015939f39cf2',
      'http://localhost:8883/deploy/notifications/deployment',
      '77777777-3702-4c4e-8d92-015939f39cf2',
      '580a7726-a274-4fc3-9ec1-44e3563d58af',
      circle,
      DeploymentStatusEnum.CREATED,
      [modules],
      defaultCircle
    )

    return createDeploymentDto
  }

  const createDeploymentAndExecution = async(params: any, fixtureUtilsService: FixtureUtilsService, manager: any, status: DeploymentStatusEnum): Promise<DeploymentEntity> => {
    const components = params.components.map((c: any) => {
      const component = new ComponentEntity(
        c.helmRepository,
        c.buildImageTag,
        c.buildImageUrl,
        c.componentName,
        c.componentId,
        c.hostValue,
        c.gatewayName
      )
      component.running = true
      return component
    })

    const configEntity = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'http://localhost:9000/ok', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    const cdConfiguration = await fixtureUtilsService.createEncryptedConfiguration(configEntity)

    const deployment: DeploymentEntity = await manager.save(new DeploymentEntity(
      params.deploymentId,
      params.authorId,
      params.circle,
      cdConfiguration,
      params.callbackUrl,
      components,
      params.defaultCircle
    ))

    await manager.save(new Execution(deployment, ExecutionTypeEnum.DEPLOYMENT, null, status))

    return deployment
  }
})
