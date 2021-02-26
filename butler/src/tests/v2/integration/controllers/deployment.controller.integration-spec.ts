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

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../../../app/app.module'
import { CdConfigurationEntity } from '../../../../app/v2/api/configurations/entity'
import { CdTypeEnum } from '../../../../app/v2/api/configurations/enums'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { EntityManager } from 'typeorm'
import { ReadDeploymentDto } from '../../../../app/v2/api/deployments/dto/read-deployment.dto'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { GitProvidersEnum } from '../../../../app/v2/core/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { UrlConstants } from '../test-constants'

describe('DeploymentController v2', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
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
    TestSetupUtils.seApplicationConstants()
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    manager = fixtureUtilsService.connection.manager
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
      CdTypeEnum.OCTOPIPE,
      { provider: ClusterProviderEnum.DEFAULT, gitProvider: GitProvidersEnum.GITHUB, gitToken: 'my-token', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: UrlConstants.helmRepository,
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: false
    }

    const expectedResponse : ReadDeploymentDto = {
      applicationName: cdConfiguration.id,
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      circle: { headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583' },
      createdAt: expect.any(String),
      defaultCircle: false,
      description: '',
      id: expect.any(String),
      modulesDeployments: [
        {
          id: 'dummy-id',
          moduleId: 'dummy-module-id',
          createdAt: expect.any(String),
          helmRepository: UrlConstants.helmRepository,
          componentsDeployments: [
            {
              id: expect.any(String),
              buildImageTag: 'tag1',
              buildImageUrl: 'imageurl.com',
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              componentName: 'component-name',
              createdAt: expect.any(String),
              hostValue: null,
              gatewayName: null
            }
          ]
        }
      ],
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(201)
      .expect(response => {
        expect(response.body).toEqual(expectedResponse)
      })
  })

  it('returns not found error for valid params without existing cdConfiguration', async() => {
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: UrlConstants.helmRepository,
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: '067765f8-aa29-49f7-bf2b-3ec676a71583',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: false
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(404)
      .expect(response => {
        expect(response.body).toEqual(
          {
            error: 'Not Found',
            message: 'CdConfiguration not found - id: 067765f8-aa29-49f7-bf2b-3ec676a71583',
            statusCode: 404
          })
      })
  })

  it('returns error message for empty payload', async() => {
    const createDeploymentRequest = {}
    const errorResponse = {
      errors: [
        {
          status: 400,
          detail: '"deploymentId" is required',
          source: {
            pointer: 'deploymentId'
          },
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          }
        },
        {
          status: 400,
          detail: '"defaultCircle" is required',
          source: {
            pointer: 'defaultCircle'
          },
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          }
        },
        {
          status: 400,
          detail: '"modules" is required',
          source: {
            pointer: 'modules'
          },
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          }
        },
        {
          status: 400,
          detail: '"authorId" is required',
          source: {
            pointer: 'authorId'
          },
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          }
        },
        {
          status: 400,
          detail: '"cdConfigurationId" is required',
          source: {
            pointer: 'cdConfigurationId'
          },
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          }
        },
        {
          status: 400,
          detail: '"callbackUrl" is required',
          source: {
            pointer: 'callbackUrl'
          },
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          }
        }
      ]
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual(errorResponse)
      })
  })

  it('create execution for the deployment', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      { provider: ClusterProviderEnum.DEFAULT, gitProvider: GitProvidersEnum.GITHUB, gitToken: 'my-token', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: UrlConstants.helmRepository,
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: false
    }
    const response = await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'ab1c7726-a274-4fc3-9ec1-44e3563d58af')

    const executionsCount = await manager.findAndCount(Execution)
    expect(executionsCount[1]).toEqual(1)
    const execution = await manager.findOneOrFail(Execution, { relations: ['deployment'] })
    expect(execution.deployment.id).toEqual(response.body.id)
  })

  it('returns error for malformed payload', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      { provider: ClusterProviderEnum.DEFAULT, gitProvider: GitProvidersEnum.GITHUB, gitToken: 'my-token', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: UrlConstants.helmRepository,
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            },
            {
              componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            },
            {
              componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com2 ',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            },
            {
              componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl-ends-with-dash.com3-',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            },
            {
              componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: `very-long-url${'4'.repeat(237)}.com`, // max is 253 because of kubernetes
              buildImageTag: 'tag1',
              componentName: 'component-name'
            },
            {
              componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'quiz-app-backend',
              buildImageTag: 'tag1',
              componentName: 'component-name'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: false
    }
    const errorResponse = {
      errors: [
        {
          detail: '"buildImageUrl" with value "imageurl.com2 " fails to match the required pattern: /^[a-zA-Z0-9][a-zA-Z0-9-.:/]*[a-zA-Z0-9]$/',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'modules/0/components/2/buildImageUrl'
          },
          status: 400
        },
        {
          detail: '"buildImageUrl" with value "imageurl-ends-with-dash.com3-" fails to match the required pattern: /^[a-zA-Z0-9][a-zA-Z0-9-.:/]*[a-zA-Z0-9]$/',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'modules/0/components/3/buildImageUrl'
          },
          status: 400
        },
        {
          detail: '"buildImageUrl" length must be less than or equal to 253 characters long',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'modules/0/components/4/buildImageUrl'
          },
          status: 400
        },
        {
          detail: '"components" contains a duplicate value',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'modules/0/components/1'
          },
          status: 400
        }
      ]
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual(errorResponse)
      })
  })

  it('returns error for empty components', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.SPINNAKER,
      { account: 'my-account', gitAccount: 'git-account', url: 'www.spinnaker.url', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: 'https://some-helm.repo',
          components: []
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: false
    }
    const errorResponse = {
      errors: [
        {
          detail: '"components" must contain at least 1 items',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'modules/0/components'
          },
          status: 400
        }
      ]
    }

    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual(errorResponse)
      })
  })

  it('saves the host value / gateway name parameters correctly', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      { provider: ClusterProviderEnum.DEFAULT, gitProvider: GitProvidersEnum.GITHUB, gitToken: 'my-token', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: UrlConstants.helmRepository,
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'tag1',
              componentName: 'component-name',
              hostValue: 'host-value-1',
              gatewayName: 'gateway-name-1'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: false
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(201)
      .expect(response => {
        expect(response.body.modulesDeployments[0].componentsDeployments[0].hostValue).toEqual('host-value-1')
        expect(response.body.modulesDeployments[0].componentsDeployments[0].gatewayName).toEqual('gateway-name-1')
      })
  })

  it('validates size of componentName + buildImageTag concatenation', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      { provider: ClusterProviderEnum.DEFAULT, gitProvider: GitProvidersEnum.GITHUB, gitToken: 'my-token', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: UrlConstants.helmRepository,
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: '11111111111111111111111111111111',
              componentName: '22222222222222222222222222222222',
              hostValue: 'host-value-1',
              gatewayName: 'gateway-name-1'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: true
    }

    const errorResponse = {
      errors: [
        {
          detail: 'Sum of lengths of componentName and buildImageTag cant be greater than 63',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'modules/0/components/0'
          },
          status: 400
        }
      ]
    }

    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual(errorResponse)
      })

  })

  it('validates imageTag is equal to suplied tag on imageUrl', async() => {
    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      { provider: ClusterProviderEnum.DEFAULT, gitProvider: GitProvidersEnum.GITHUB, gitToken: 'my-token', namespace: 'my-namespace' },
      'config-name',
      'authorId',
      'workspaceId'
    )
    await fixtureUtilsService.createEncryptedConfiguration(cdConfiguration)
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      modules: [
        {
          moduleId: 'acf45587-3684-476a-8e6f-b479820a8cd5',
          helmRepository: UrlConstants.helmRepository,
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com:someTag',
              buildImageTag: 'differentTag',
              componentName: 'my-component',
              hostValue: 'host-value-1',
              gatewayName: 'gateway-name-1'
            },
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl2.com:anotherTag',
              buildImageTag: 'anotherTag',
              componentName: 'my-other-component'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      defaultCircle: true
    }

    const errorResponse = {
      errors: [
        {
          detail: 'The tag suplied on the buildImageUrl must match the buildImageTag',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'modules/0/components/0'
          },
          status: 400
        }
      ]
    }

    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual(errorResponse)
      })
  })
})
