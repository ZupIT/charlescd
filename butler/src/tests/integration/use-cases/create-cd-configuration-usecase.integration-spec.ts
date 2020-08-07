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
import { TestSetupUtils } from '../utils/test-setup-utils'
import { FixtureUtilsService } from '../utils/fixture-utils.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../../app/app.module'
import { INestApplication } from '@nestjs/common'
import * as uuid from 'uuid'
import { CdTypeEnum } from '../../../app/v1/api/configurations/enums'
import { GitProvidersEnum } from '../../../app/v1/core/integrations/configuration/interfaces'
import { ClusterProviderEnum } from '../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import * as request from 'supertest'
import { CdConfigurationEntity } from '../../../app/v1/api/configurations/entity'
import { IDefaultConfig } from '../../../app/v1/api/configurations/interfaces/octopipe-configuration-data.type'
import anything = jasmine.anything

describe('CreateCdConfiguration Integration Test', () => {

  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService

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
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('/POST /cd should return conflict if namespace already exists', async() => {

    const cdConfigurationData:IDefaultConfig = {
      gitProvider: GitProvidersEnum.GITHUB,
      provider: ClusterProviderEnum.DEFAULT,
      gitToken: 'my-token',
      namespace: 'qa',
    }

    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      cdConfigurationData,
      'config-name',
      'author-id',
      'workspace-id')

    await fixtureUtilsService.createCdConfiguration({
      id: uuid.v4(),
      workspaceId: uuid.v4(),
      type: CdTypeEnum.OCTOPIPE,
      configurationData: '\\xc30d040703028145eac3aeef760075d28e0184ce9ccba1f87c8346be787f60048e1b0a8df966b3fc0d555621c6b85546779a6c3825a975bf799a7757635c3cb34b2b85b00e3f296d3afee23d5c77947b7077c43247b6c26a23963f5f90135555a5706f73d5dfca32505f688129401ec015eba68fe0cd59eecfae09abfb3f8d533d225ab15aba239599f85af8804f23eb8ecb2318d502ae1f727a64afe33f8c',
      name: 'config-name',
      authorId: 'author'
    })

    const response = await request(app.getHttpServer()).post('/configurations/cd').send(cdConfiguration).set('x-workspace-id', '12345')

    const responseObject = JSON.parse(response.text)
    expect(responseObject.message).toBe('Namespace already registered')
    expect(responseObject.statusCode).toBe(409)
  })

  it('/POST /cd should create cdconfiguration if namespace is not registered yet', async() => {
    const cdConfigurationData:IDefaultConfig = {
      gitProvider: GitProvidersEnum.GITHUB,
      provider: ClusterProviderEnum.DEFAULT,
      gitToken: 'my-token',
      namespace: 'qa',
    }

    const cdConfiguration = new CdConfigurationEntity(
      CdTypeEnum.OCTOPIPE,
      cdConfigurationData,
      'config-name',
      'author-id',
      'workspace-id')

    const response = await request(app.getHttpServer()).post('/configurations/cd').send(cdConfiguration).set('x-workspace-id', '12345')
    const responseObject = JSON.parse(response.text)
    expect(response.status).toBe(201)
    expect(responseObject).toMatchObject(
      {
        name: cdConfiguration.name,
        authorId: cdConfiguration.authorId,
        workspaceId: '12345',
        createdAt: anything()
      })
  })
})
