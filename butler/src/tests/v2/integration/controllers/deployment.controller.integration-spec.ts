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

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../../../app/app.module'
import { DeploymentEntityV2 } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { GitProvidersEnum } from '../../../../app/v2/core/configuration/interfaces'
import { FixtureUtilsService } from '../fixture-utils.service'
import { UrlConstants } from '../test-constants'
import { TestSetupUtils } from '../test-setup-utils'
import { EntityManager } from 'typeorm'
import { ComponentEntityV2 } from '../../../../app/v2/api/deployments/entity/component.entity'
import { LogEntity } from '../../../../app/v2/api/deployments/entity/logs.entity'

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

    TestSetupUtils.seApplicationConstants()
    app = await TestSetupUtils.createApplication(module)
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    manager = fixtureUtilsService.manager
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('returns error message for empty payload', async() => {
    const createDeploymentRequest = {}
    const errorResponse = {
      errors: [
        {
          title: '"deploymentId" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'deploymentId'
          },
          status: 400
        },
        {
          title: '"namespace" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'namespace'
          },
          status: 400
        },
        {
          title: '"circle" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'circle'
          },
          status: 400
        },
        {
          title: '"git" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'git'
          },
          status: 400
        },
        {
          title: '"components" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components'
          },
          status: 400
        },
        {
          title: '"authorId" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'authorId'
          },
          status: 400
        },
        {
          title: '"callbackUrl" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'callbackUrl'
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

  it('create execution for the deployment', async() => {
    const encryptedToken = `-----BEGIN PGP MESSAGE-----

ww0ECQMCcRYScW+NJZZy0kUBbjTidEUAU0cTcHycJ5Phx74jvSTZ7ZE7hxK9AejbNDe5jDRGbqSd
BSAwlmwpOpK27k2yXj4g1x2VaF9GGl//Ere+xUY=
=QGZf
-----END PGP MESSAGE-----
`
    const base64Token = Buffer.from(encryptedToken).toString('base64')

    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      git: {
        token: base64Token,
        provider: GitProvidersEnum.GITHUB
      },
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
    }
    const response = await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'ab1c7726-a274-4fc3-9ec1-44e3563d58af')
      .expect(response => {
        expect(response.body).toEqual({
          id: expect.anything()
        })
      })

    const executionsCount = await manager.findAndCount(Execution)
    expect(executionsCount[1]).toEqual(1)
    const execution = await manager.findOneOrFail(Execution, { relations: ['deployment'] })
    expect(execution.deployment.id).toEqual(response.body.id)
  })

  it('returns bad request when tag not respect the dns label format ', async() => {
    const encryptedToken = `-----BEGIN PGP MESSAGE-----

ww0ECQMCcRYScW+NJZZy0kUBbjTidEUAU0cTcHycJ5Phx74jvSTZ7ZE7hxK9AejbNDe5jDRGbqSd
BSAwlmwpOpK27k2yXj4g1x2VaF9GGl//Ere+xUY=
=QGZf
-----END PGP MESSAGE-----
`
    const base64Token = Buffer.from(encryptedToken).toString('base64')

    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      git: {
        token: base64Token,
        provider: GitProvidersEnum.GITHUB
      },
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'UPPER-tag',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
    }
    const expectedError = {
      errors: [
        {
          title: 'tag must consist of lower case alphanumeric characters, "-" or ".", and must start and end with an alphanumeric character',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components/0'
          },
          status: 400
        }
      ]
    }
    const response = await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'ab1c7726-a274-4fc3-9ec1-44e3563d58af')

    expect(response.body).toEqual(expectedError)

  })

  it('returns a bad request error when the git token decryption fail', async() => {
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      git: {
        token: Buffer.from('malformed token').toString('base64'),
        provider: GitProvidersEnum.GITHUB
      },
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
    }

    const expectedError = {
      errors: [
        {
          title: 'Unable to decrypt "token"',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'git.token'
          },
          status: 400
        }
      ]
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'ab1c7726-a274-4fc3-9ec1-44e3563d58af')
      .expect(400)
      .expect(response => {
        expect(response.body).toEqual(expectedError)
      })
  })

  it('returns error for malformed payload', async() => {
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        headerValue: '333365f8-bb29-49f7-bf2b-3ec956a71583'
      },
      components: [
        {
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          helmRepository: UrlConstants.helmRepository
        },
        {
          componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          helmRepository: UrlConstants.helmRepository
        },
        {
          componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com2 ',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          helmRepository: UrlConstants.helmRepository
        },
        {
          componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl-ends-with-dash.com3-',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          helmRepository: UrlConstants.helmRepository
        },
        {
          componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: `very-long-url${'4'.repeat(237)}.com`, // max is 253 because of kubernetes
          buildImageTag: 'tag1',
          componentName: 'component-name',
          helmRepository: UrlConstants.helmRepository
        },
        {
          componentId: '888865f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'quiz-app-backend',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          helmRepository: UrlConstants.helmRepository
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl
    }
    const errorResponse = {
      errors: [
        {
          title: '"namespace" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'namespace'
          },
          status: 400
        },
        {
          title: '"circle.id" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'circle/id'
          },
          status: 400
        },
        {
          title: '"circle.default" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'circle/default'
          },
          status: 400
        },
        {
          title: '"circle.headerValue" is not allowed',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'circle/headerValue'
          },
          status: 400
        },
        {
          title: '"git" is required',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'git'
          },
          status: 400
        },
        {
          title: expect.stringContaining('"buildImageUrl" with value "imageurl.com2 " fails to match the required pattern'),
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components/2/buildImageUrl'
          },
          status: 400
        },
        {
          title: expect.stringContaining('"buildImageUrl" with value "imageurl-ends-with-dash.com3-" fails to match the required pattern'),
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components/3/buildImageUrl'
          },
          status: 400
        },
        {
          title: '"buildImageUrl" length must be less than or equal to 253 characters long',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components/4/buildImageUrl'
          },
          status: 400
        },
        {
          title: '"components" contains a duplicate value',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components/1'
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
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      git: {
        token: Buffer.from('123123').toString('base64'),
        provider: 'GITHUB'
      },
      components: [],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl
    }
    const errorResponse = {
      errors: [
        {
          title: '"components" must contain at least 1 items',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components'
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

  it('saves optional parameters correctly', async() => {
    const encryptedToken = `
-----BEGIN PGP MESSAGE-----

ww0ECQMCcRYScW+NJZZy0kUBbjTidEUAU0cTcHycJ5Phx74jvSTZ7ZE7hxK9AejbNDe5jDRGbqSd
BSAwlmwpOpK27k2yXj4g1x2VaF9GGl//Ere+xUY=
=QGZf
-----END PGP MESSAGE-----
`

    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      git: {
        token: Buffer.from(encryptedToken).toString('base64'),
        provider: 'GITHUB'
      },
      components: [
        {
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: 'component-name',
          hostValue: 'host-value-1',
          gatewayName: 'gateway-name-1',
          helmRepository: UrlConstants.helmRepository,
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      timeoutInSeconds: 10
    }
    const response = await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(201)

    const deployment = await manager.findOneOrFail(DeploymentEntityV2, response.body.id, { relations: ['components'] })
    expect(deployment.components.map(c => c.hostValue)).toEqual(['host-value-1'])
    expect(deployment.components.map(c => c.gatewayName)).toEqual(['gateway-name-1'])
    expect(deployment.timeoutInSeconds).toEqual(10)
  })

  it('validates size of componentName + buildImageTag concatenation', async() => {
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      git: {
        token: Buffer.from('123123').toString('base64'),
        provider: 'GITHUB'
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: '11111111111111111111111111111111',
          componentName: '22222222222222222222222222222222',
          hostValue: 'host-value-1',
          gatewayName: 'gateway-name-1'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
    }

    const errorResponse = {
      errors: [
        {
          title: 'Sum of lengths of componentName and buildImageTag cant be greater than 63',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components/0'
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
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      git: {
        token: Buffer.from('123123').toString('base64'),
        provider: 'GITHUB'
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,

          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com:some-tag',
          buildImageTag: 'different-tag',
          componentName: 'my-component',
          hostValue: 'host-value-1',
          gatewayName: 'gateway-name-1'
        },
        {
          helmRepository: UrlConstants.helmRepository,

          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl2.com:another-tag',
          buildImageTag: 'another-tag',
          componentName: 'my-other-component'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl
    }

    const errorResponse = {
      errors: [
        {
          title: 'The tag suplied on the buildImageUrl must match the buildImageTag',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'components/0'
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

  it('returns an error when there is one active default deployment on the same namespace with a different circle id', async() => {
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: true
      },
      git: {
        token: Buffer.from('123123').toString('base64'),
        provider: 'GITHUB'
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com:some-tag',
          buildImageTag: 'some-tag',
          componentName: 'my-component',
          hostValue: 'host-value-1',
          gatewayName: 'gateway-name-1'
        },
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl2.com:another-tag',
          buildImageTag: 'another-tag',
          componentName: 'my-other-component'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl
    }

    const sameNamespaceActiveDeployment = new DeploymentEntityV2(
      '6d1e1881-72d3-4fb5-84da-8bd61bb8e2d3',
      '580a7726-a274-4fc3-9ec1-44e3563d58af',
      'ad03d665-f689-42aa-b1de-d19653e89b86',
      UrlConstants.deploymentCallbackUrl,
      [
        new ComponentEntityV2(
          UrlConstants.helmRepository,
          'currenttag',
          'imageurl.com:currenttag',
          'my-component',
          '777765f8-bb29-49f7-bf2b-3ec956a71583',
          'host-value-1',
          'gateway-name-1',
          []
        )
      ],
      true,
      'default',
      120,
    )
    sameNamespaceActiveDeployment.current = true

    await manager.save(sameNamespaceActiveDeployment)

    const errorResponse = {
      errors: [
        {
          title: 'Invalid circle id.',
          detail: 'Namespace already has an active default deployment.',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'circle/id'
          },
          status: 409
        }
      ]
    }
    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(409)
      .expect(response => {
        expect(response.body).toEqual(errorResponse)
      })
  })

  it('allows a default circle deployment when there is one active default deployment on a different namespace', async() => {
    const encryptedToken = `
-----BEGIN PGP MESSAGE-----

ww0ECQMCcRYScW+NJZZy0kUBbjTidEUAU0cTcHycJ5Phx74jvSTZ7ZE7hxK9AejbNDe5jDRGbqSd
BSAwlmwpOpK27k2yXj4g1x2VaF9GGl//Ere+xUY=
=QGZf
-----END PGP MESSAGE-----
`

    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: true
      },
      git: {
        token: Buffer.from(encryptedToken).toString('base64'),
        provider: 'GITHUB'
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com:some-tag',
          buildImageTag: 'some-tag',
          componentName: 'my-component',
          hostValue: 'host-value-1',
          gatewayName: 'gateway-name-1'
        },
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl2.com:another-tag',
          buildImageTag: 'another-tag',
          componentName: 'my-other-component'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl
    }

    const differentNamespaceActiveDeployment = new DeploymentEntityV2(
      '6d1e1881-72d3-4fb5-84da-8bd61bb8e2d3',
      '580a7726-a274-4fc3-9ec1-44e3563d58af',
      'ad03d665-f689-42aa-b1de-d19653e89b86',
      UrlConstants.deploymentCallbackUrl,
      [
        new ComponentEntityV2(
          UrlConstants.helmRepository,
          'current-tag',
          'imageurl.com:current-tag',
          'my-component',
          '777765f8-bb29-49f7-bf2b-3ec956a71583',
          'host-value-1',
          'gateway-name-1',
          []
        )
      ],
      true,
      'test2',
      120,
    )
    differentNamespaceActiveDeployment.current = true

    await manager.save(differentNamespaceActiveDeployment)

    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(201)
  })

  it('allows a circle deployment when there is one active circle deployment on the same namespace', async() => {
    const encryptedToken = `
-----BEGIN PGP MESSAGE-----

ww0ECQMCcRYScW+NJZZy0kUBbjTidEUAU0cTcHycJ5Phx74jvSTZ7ZE7hxK9AejbNDe5jDRGbqSd
BSAwlmwpOpK27k2yXj4g1x2VaF9GGl//Ere+xUY=
=QGZf
-----END PGP MESSAGE-----
`

    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      git: {
        token: Buffer.from(encryptedToken).toString('base64'),
        provider: 'GITHUB'
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com:some-tag',
          buildImageTag: 'some-tag',
          componentName: 'my-component',
          hostValue: 'host-value-1',
          gatewayName: 'gateway-name-1'
        },
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl2.com:another-tag',
          buildImageTag: 'another-tag',
          componentName: 'my-other-component'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl
    }

    const differentNamespaceActiveDeployment = new DeploymentEntityV2(
      '6d1e1881-72d3-4fb5-84da-8bd61bb8e2d3',
      '580a7726-a274-4fc3-9ec1-44e3563d58af',
      'ad03d665-f689-42aa-b1de-d19653e89b86',
      UrlConstants.deploymentCallbackUrl,
      [
        new ComponentEntityV2(
          UrlConstants.helmRepository,
          'currenttag',
          'imageurl.com:currenttag',
          'my-component',
          '777765f8-bb29-49f7-bf2b-3ec956a71583',
          'host-value-1',
          'gateway-name-1',
          []
        )
      ],
      false,
      'default',
      120,
    )
    differentNamespaceActiveDeployment.current = true

    await manager.save(differentNamespaceActiveDeployment)

    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(201)
  })

  it('returns correct error when git token is not valid', async() => {
    const encryptedToken = 'invalid-token'

    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      namespace: 'default',
      circle: {
        id: '333365f8-bb29-49f7-bf2b-3ec956a71583',
        default: false
      },
      git: {
        token: Buffer.from(encryptedToken).toString('base64'),
        provider: 'GITHUB'
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com:some-tag',
          buildImageTag: 'some-tag',
          componentName: 'my-component',
          hostValue: 'host-value-1',
          gatewayName: 'gateway-name-1'
        },
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl2.com:another-tag',
          buildImageTag: 'another-tag',
          componentName: 'my-other-component'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl
    }

    const errorResponse = {
      errors: [
        {
          title: 'Unable to decrypt "token"',
          meta: {
            component: 'butler',
            timestamp: expect.anything()
          },
          source: {
            pointer: 'git.token'
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

  it('returns logs from deployment id', async() => {
    const deploymentId = '6d1e1881-72d3-4fb5-84da-8bd61bb8e2d3'
    const deployment = new DeploymentEntityV2(
      deploymentId,
      '580a7726-a274-4fc3-9ec1-44e3563d58af',
      'ad03d665-f689-42aa-b1de-d19653e89b86',
      UrlConstants.deploymentCallbackUrl,
      [
        new ComponentEntityV2(
          UrlConstants.helmRepository,
          'currenttag',
          'imageurl.com:currenttag',
          'my-component',
          '777765f8-bb29-49f7-bf2b-3ec956a71583',
          'host-value-1',
          'gateway-name-1',
          []
        )
      ],
      true,
      'default',
      120,
    )

    await manager.save(deployment)

    const log = new LogEntity (
      deploymentId,
      [
        {
          type: 'INFO',
          title: 'Created',
          details: '{"message":"Container image "paulczar/gb-frontend:v5" already present on machine","object":"Pod/frontend-7cb5fb8b96-prqxv"}',
          timestamp: '2021-04-29T10:17:24-03:00'
        }
      ]
    )
    await manager.save(log)

    await request(app.getHttpServer())
      .get(`/v2/deployments/${deploymentId}/logs`)
      .expect(200)
      .expect(response => {
        expect(response.body).toEqual({
          logs: [
            {
              type: 'INFO',
              title: 'Created',
              details: '{"message":"Container image "paulczar/gb-frontend:v5" already present on machine","object":"Pod/frontend-7cb5fb8b96-prqxv"}',
              timestamp: '2021-04-29T10:17:24-03:00'
            }
          ]
        })
      })
  })
})
