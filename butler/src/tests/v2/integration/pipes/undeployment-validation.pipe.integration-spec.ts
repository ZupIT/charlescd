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
import { HttpException, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { EntityManager } from 'typeorm'
import { AppModule } from '../../../../app/app.module'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { Execution } from '../../../../app/v2/api/deployments/entity/execution.entity'
import { ExecutionTypeEnum } from '../../../../app/v2/api/deployments/enums'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'
import { UndeploymentValidation } from '../../../../app/v2/api/deployments/pipes/undeployment-validation.pipe'
import { KubernetesManifest } from '../../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'
import { simpleManifests } from '../../fixtures/manifests.fixture'
import { FixtureUtilsService } from '../fixture-utils.service'
import { UrlConstants } from '../test-constants'
import { TestSetupUtils } from '../test-setup-utils'
import { ExceptionBuilder } from '../../../../app/v2/core/utils/exception.utils'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'

describe('DeploymentCleanupHandler', () => {
  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let pipe: UndeploymentValidation
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
    fixtureUtilsService = app.get<FixtureUtilsService>(FixtureUtilsService)
    pipe = app.get<UndeploymentValidation>(UndeploymentValidation)
    manager = fixtureUtilsService.manager
    manifests = simpleManifests
    TestSetupUtils.seApplicationConstants()
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('returns not found error when trying to undeploy non existing deployment', async() => {
    const nonExistingDeploymentId = '333365f8-bb29-49f7-bf2b-3ec956a71583'
    const errorMessage =
    `Could not find any entity of type "DeploymentEntityV2" matching: {
    "id": "333365f8-bb29-49f7-bf2b-3ec956a71583"
}`

    await expect(
      pipe.transform(nonExistingDeploymentId)
    ).rejects.toThrow(new HttpException(errorMessage, HttpStatus.BAD_REQUEST))

  })

  it('returns error message when trying to undeploy not active deployment', async() => {
    const circleId = '333365f8-bb29-49f7-bf2b-3ec956a71583'
    const componentName = 'component-name'

    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: circleId,
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: componentName
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af',
      defaultCircle: false
    }

    const deployment = await createDeploymentAndExecution(params, fixtureUtilsService, manifests, manager, false, false)
    await expect(
      pipe.transform(deployment.id)
    ).rejects.toThrow(new ExceptionBuilder(
      'Cannot undeploy not current deployment', HttpStatus.BAD_REQUEST)
      .build())
  })

  it('allows undeployment of active deployment', async() => {
    const circleId = '333365f8-bb29-49f7-bf2b-3ec956a71583'
    const componentName = 'component-name'

    const params = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: circleId,
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'tag1',
          componentName: componentName
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      incomingCircleId: 'ab0a7726-a274-4fc3-9ec1-44e3563d58af',
      defaultCircle: false
    }

    const deployment = await createDeploymentAndExecution(params, fixtureUtilsService, manifests, manager, true, false)
    expect(await pipe.transform(deployment.id)).toEqual(deployment.id)
  })

})

const createDeploymentAndExecution = async(params: any, fixtureUtilsService: FixtureUtilsService, manifests: KubernetesManifest[], manager: any, status: boolean, running: boolean): Promise<DeploymentEntity> => {
  const components = params.components.map((c: any) => {
    const component = new ComponentEntity(
      c.helmRepository,
      c.buildImageTag,
      c.buildImageUrl,
      c.componentName,
      c.componentId,
      c.hostValue,
      c.gatewayName,
      manifests
    )
    component.running = running
    return component
  })

  const deployment : DeploymentEntity = await manager.save(new DeploymentEntity(
    params.deploymentId,
    params.authorId,
    params.circle,
    params.callbackUrl,
    components,
    params.defaultCircle,
    'my-namespace',
    5
  ))

  deployment.current = status

  await manager.update(DeploymentEntity, { id: deployment.id }, { current: status })

  await manager.save(new Execution(deployment, ExecutionTypeEnum.DEPLOYMENT, null, DeploymentStatusEnum.SUCCEEDED))

  return deployment
}
