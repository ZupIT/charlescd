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
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { KubernetesManifest } from '../../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'
import * as request from 'supertest'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v2/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { defaultManifests } from '../../fixtures/manifests.fixture'

describe('DeploymentController v2', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let manager: EntityManager
  let manifests: KubernetesManifest[]
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
    TestSetupUtils.seApplicationConstants()
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    manager = fixtureUtilsService.connection.manager
    manifests = defaultManifests
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('returns ok for valid params with existing cdConfiguration', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)

    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'http://localhost:8883/repos/charlescd-fake/helm-chart',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      defaultCircle: false
    }

    const firstExecution = await createDeploymentAndExecution(params, cdConfiguration, manifests, manager)
    const secondExecution = await createDeploymentAndExecution({ ...params, deploymentId: 'a33365f8-bb29-49f7-bf2b-3ec956a71583' }, cdConfiguration, manifests, manager)
    const thirdExecution = await createDeploymentAndExecution({ ...params, deploymentId: 'b33365f8-bb29-49f7-bf2b-3ec956a71583' }, cdConfiguration, manifests, manager)

    await request(app.getHttpServer())
      .get('/v2/executions').query({ current: false, size: 1, page: 0 })
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(200)
      .expect(response => {
        expect(response.body.executions.length).toEqual(1)
        expect(response.body.executions[0].id).toEqual(thirdExecution.id)
        expect(response.body.page).toEqual(0)
        expect(response.body.size).toEqual(1)
        expect(response.body.totalPages).toEqual(3)
        expect(response.body.last).toEqual(false)
      })

    // testing pagination
    await request(app.getHttpServer())
      .get('/v2/executions')
      .query({ current: false, size: 1, page: 1 })
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(200)
      .expect(response => {
        expect(response.body.executions.length).toEqual(1)
        expect(response.body.executions[0].id).toEqual(secondExecution.id)
        expect(response.body.page).toEqual(1)
        expect(response.body.size).toEqual(1)
        expect(response.body.totalPages).toEqual(3)
        expect(response.body.last).toEqual(false)
      })

    // testing pagination
    await request(app.getHttpServer())
      .get('/v2/executions')
      .query({ current: false, size: 1, page: 2 })
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(200)
      .expect(response => {
        expect(response.body.executions.length).toEqual(1)
        expect(response.body.executions[0].id).toEqual(firstExecution.id)
        expect(response.body.page).toEqual(2)
        expect(response.body.size).toEqual(1)
        expect(response.body.totalPages).toEqual(3)
        expect(response.body.last).toEqual(true)
      })
  })

  it('validate query string parameters', async() => {
    const errorMessages = {
      error: 'Bad Request',
      message: [
        'size must not be less than 1',
        'page must not be less than 0'
      ],
      statusCode: 400
    }
    await request(app.getHttpServer())
      .get('/v2/executions').query({ current: false, size: 0, page: -1 })
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(response => {
        expect(response.body).toEqual(errorMessages)
      })
  })

  it('returns the right entity values', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)

    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'http://localhost:8883/repos/charlescd-fake/helm-chart',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          hostValue: 'host-value',
          gatewayName: 'gateway-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      defaultCircle: false
    }

    await createDeploymentAndExecution(params, cdConfiguration, manifests, manager)
    const expectedBody = {
      createdAt: expect.any(String),
      deployment: {
        current: false,
        author_id: '580a7726-a274-4fc3-9ec1-44e3563d58af',
        callback_url: 'http://localhost:8883/deploy/notifications/deployment',
        cd_configuration_id: expect.any(String),
        circle_id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        components: [
          {
            id: expect.any(String),
            image_tag: 'tag1',
            image_url: 'imageurl.com',
            merged: false,
            name: 'component-name',
            running: false,
            hostValue: 'host-value',
            gatewayName: 'gateway-name'
          }
        ],
        created_at: expect.any(String),
        id: '28a3f957-3702-4c4e-8d92-015939f39cf2'
      },
      finishedAt: null,
      id: expect.any(String),
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      notificationStatus: 'NOT_SENT',
      status: 'CREATED',
      type: 'DEPLOYMENT'
    }

    await request(app.getHttpServer())
      .get('/v2/executions').query({ current: false, size: 1, page: 0 })
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(200)
      .expect(response => {
        expect(response.body.executions[0]).toEqual(expectedBody)
      })
  })
})

const createDeploymentAndExecution = async(params: any, cdConfiguration: CdConfigurationEntity, manifests: KubernetesManifest[], manager: any) : Promise<Execution> => {
  const components = params.components.map((c: any) => {
    return new ComponentEntity(
      c.helmRepository,
      c.buildImageTag,
      c.buildImageUrl,
      c.componentName,
      c.componentId,
      c.hostValue,
      c.gatewayName,
      manifests
    )
  })

  const deployment : DeploymentEntity = await manager.save(new DeploymentEntity(
    params.deploymentId,
    params.authorId,
    params.circle,
    cdConfiguration,
    params.callbackUrl,
    components,
    params.defaultCircle
  ))

  const execution : Execution = await manager.save(new Execution(
    deployment,
    ExecutionTypeEnum.DEPLOYMENT,
    params.incomingCircleId,
    params.deploymentStatus,
  ))
  return execution
}
