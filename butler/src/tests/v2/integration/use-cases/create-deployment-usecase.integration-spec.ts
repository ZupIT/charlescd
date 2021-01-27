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
import { FixtureUtilsService } from '../fixture-utils.service'
import { TestSetupUtils } from '../test-setup-utils'
import { EntityManager } from 'typeorm'
import { DeploymentEntityV2 as DeploymentEntity } from '../../../../app/v2/api/deployments/entity/deployment.entity'
import { ComponentEntityV2 as ComponentEntity } from '../../../../app/v2/api/deployments/entity/component.entity'
import { PgBossWorker } from '../../../../app/v2/api/deployments/jobs/pgboss.worker'

describe('CreateDeploymentUsecase v2', () => {
  let fixtureUtilsService: FixtureUtilsService
  let app: INestApplication
  let worker: PgBossWorker
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
    worker = app.get<PgBossWorker>(PgBossWorker)
    manager = fixtureUtilsService.connection.manager
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.clearStorage()
    await worker.pgBoss.stop()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
    await worker.pgBoss.start()
    await worker.pgBoss.clearStorage()
  })

  it('should only merge default circle components from the previous deployment entity of that circle', async() => {
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
          components: [
            {
              componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
              buildImageUrl: 'imageurl.com',
              buildImageTag: 'v2',
              componentName: 'A'
            }
          ]
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      cdConfigurationId: cdConfiguration.id,
      callbackUrl: 'http://localhost:8883/deploy/notifications/deployment',
      defaultCircle: true
    }

    const component1 = new ComponentEntity(
      'https://some-helm.repo',
      'v2',
      'imageurl.com',
      'A',
      '777765f8-bb29-49f7-bf2b-3ec956a71583',
      null,
      null,
    )
    component1.running = false
    component1.id = expect.anything()
    component1.merged = false
    const component2 = new ComponentEntity(
      'http://localhost:2222/helm',
      'v1',
      'https://repository.com/B:v1',
      'B',
      '1c29210c-e313-4447-80e3-db89b2359138',
      null,
      null
    )
    component2.running = false
    component2.id = expect.anything()
    component2.merged = true

    const expectedDeploymentComponents = [
      component1,
      component2
    ]

    const sameCircleActiveDeployment: DeploymentEntity = new DeploymentEntity(
      'baa226a2-97f1-4e1b-b05a-d758839408f9',
      'user-1',
      '333365f8-bb29-49f7-bf2b-3ec956a71583',
      cdConfiguration,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/A:v1',
          'A',
          'f1c95177-438c-4c4f-94fd-c207e8d2eb61',
          null,
          null
        ),
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/B:v1',
          'B',
          '1c29210c-e313-4447-80e3-db89b2359138',
          null,
          null
        )
      ],
      true
    )
    sameCircleActiveDeployment.active = true

    const diffCircleActiveDeployment: DeploymentEntity = new DeploymentEntity(
      'd63ef13f-6138-41ca-ac64-6f5c25eb89f2',
      'user-1',
      '22220857-a638-4a4a-b513-63e3ef6f9d54',
      cdConfiguration,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/C:v1',
          'C',
          '46b83994-bfae-4f1e-84cd-0d18b59735bc',
          null,
          null
        ),
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/D:v1',
          'D',
          '5ff6c5f3-fca5-440a-aaf5-ab3c25fdf0f5',
          null,
          null
        )
      ],
      true
    )
    diffCircleActiveDeployment.active = true

    const normalCircleActiveDeployment: DeploymentEntity = new DeploymentEntity(
      '2ba59bb7-842a-43e7-b2c8-85f35d62781b',
      'user-1',
      'fcd22a4e-c192-4c86-bca2-f23de7b73757',
      cdConfiguration,
      'http://localhost:1234/notifications/deployment?deploymentId=1',
      [
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/E:v1',
          'E',
          '222cd8db-3767-45d5-a415-7cca09cccf91',
          null,
          null
        ),
        new ComponentEntity(
          'http://localhost:2222/helm',
          'v1',
          'https://repository.com/F:v1',
          'F',
          '32f24614-ecee-4ff5-aae4-2ebd7bb85c56',
          null,
          null
        )
      ],
      false
    )
    normalCircleActiveDeployment.active = true

    await manager.save(sameCircleActiveDeployment)
    await manager.save(diffCircleActiveDeployment)
    await manager.save(normalCircleActiveDeployment)

    await request(app.getHttpServer())
      .post('/v2/deployments')
      .send(createDeploymentRequest)
      .set('x-circle-id', 'a45fd548-0082-4021-ba80-a50703c44a3b')
      .expect(201)

    const newDeployment =
      await manager.findOneOrFail(DeploymentEntity, { relations: ['components'], where: { id: createDeploymentRequest.deploymentId } })

    expect(newDeployment.components).toEqual(expectedDeploymentComponents)
  })
})
