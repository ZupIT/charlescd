/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { simpleManifests } from '../../fixtures/manifests.fixture'
import { UrlConstants } from '../test-constants'

describe('Execution Controller v2', () => {
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
    manager = fixtureUtilsService.manager
    manifests = simpleManifests
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('validate query string parameters', async() => {
    const errorResponse = {
      errors: [{
        meta: {
          component: 'butler',
          timestamp: expect.anything()
        },
        source: {
          pointer: 'size'
        },
        status: 400,
        title: '"size" must be greater than or equal to 1'
      },
      {
        meta: {
          component: 'butler',
          timestamp: expect.anything()
        },
        source: {
          pointer: 'page'
        },
        status: 400,
        title: '"page" must be greater than or equal to 0'
      }]
    }
    await request(app.getHttpServer())
      .get('/v2/executions').query({ current: false, size: 0, page: -1 })
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(response => {
        expect(response.body).toEqual(errorResponse)
      })
  })

  it('returns the right entity values', async() => {
    const params = {
      defaultCircle: false,
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          hostValue: 'host-value',
          gatewayName: 'gateway-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
    }

    await createDeploymentAndExecution(params, 'namespace', manifests, manager)
    const expectedBody = {
      createdAt: expect.any(String),
      deployment: {
        current: false,
        author_id: '580a7726-a274-4fc3-9ec1-44e3563d58af',
        callback_url: UrlConstants.deploymentCallbackUrl,
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
        expect(response.body.items[0]).toEqual(expectedBody)
      })
  })

  it('parameters are optional when quering executions', async() => {
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          hostValue: 'host-value',
          gatewayName: 'gateway-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      defaultCircle: false
    }

    await createDeploymentAndExecution(params, 'default', [], manager)
    const expectedBody = {
      createdAt: expect.any(String),
      deployment: {
        current: false,
        author_id: '580a7726-a274-4fc3-9ec1-44e3563d58af',
        callback_url: 'http://localhost:8883/deploy/notifications/deployment',
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
      .get('/v2/executions')
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(200)
      .expect(response => {
        expect(response.body.items[0]).toEqual(expectedBody)
      })
  })

  it('returns correct page size and last page false', async() => {
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          hostValue: 'host-value',
          gatewayName: 'gateway-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      defaultCircle: false
    }

    await createDeploymentAndExecution(params, 'deafult', [], manager)
    await createDeploymentAndExecution({ ...params, deploymentId: 'a33365f8-bb29-49f7-bf2b-3ec956a71583' }, 'default', [], manager)
    await createDeploymentAndExecution({ ...params, deploymentId: 'b33365f8-bb29-49f7-bf2b-3ec956a71583' }, 'default', [], manager)

    await request(app.getHttpServer())
      .get('/v2/executions?size=2&page=0')
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(200)
      .expect(response => {
        expect(response.body.size).toEqual(2)
        expect(response.body.last).toEqual(false)
      })
  })

  it('returns correct page size and last page true', async() => {
    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: '333365f8-bb29-49f7-bf2b-3ec956a71583',
      components: [
        {
          helmRepository: 'https://some-helm.repo',
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          hostValue: 'host-value',
          gatewayName: 'gateway-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      incomingCircleId: '0d81c2b0-37f2-4ef9-8b96-afb2e3979a30',
      defaultCircle: false
    }

    await createDeploymentAndExecution(params, 'default', [], manager)
    await createDeploymentAndExecution({ ...params, deploymentId: 'a33365f8-bb29-49f7-bf2b-3ec956a71583' }, 'default', [], manager)
    await createDeploymentAndExecution({ ...params, deploymentId: 'b33365f8-bb29-49f7-bf2b-3ec956a71583' }, 'default', [], manager)

    await request(app.getHttpServer())
      .get('/v2/executions?size=2&page=1')
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(200)
      .expect(response => {
        expect(response.body.size).toEqual(1)
        expect(response.body.last).toEqual(true)
      })
  })
})

const createDeploymentAndExecution = async(params: any, namespace: string, manifests: KubernetesManifest[], manager: any) : Promise<Execution> => {
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
    params.callbackUrl,
    components,
    params.defaultCircle,
    namespace,
    5
  ))

  const execution : Execution = await manager.save(new Execution(
    deployment,
    ExecutionTypeEnum.DEPLOYMENT,
    params.incomingCircleId,
    params.deploymentStatus,
  ))
  return execution
}
