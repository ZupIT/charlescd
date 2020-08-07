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
import { IGenericConfig } from '../../../app/v1/api/configurations/interfaces/octopipe-configuration-data.type'
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

    const cdConfigurationData:IGenericConfig = {
      gitProvider: GitProvidersEnum.GITHUB,
      provider: ClusterProviderEnum.GENERIC,
      clientCertificate: 'cert-data',
      host: 'https://kube.cluster.com',
      gitToken: 'githubtoken',
      namespace: 'darwin',
      caData: 'ca-data',
      clientKey: 'client-key'
    }

    const cdConfiguration = new CdConfigurationEntity(CdTypeEnum.OCTOPIPE, cdConfigurationData, 'config-name', 'author-id', 'workspace-id')

    await fixtureUtilsService.createCdConfiguration({
      id: uuid.v4(),
      workspaceId: uuid.v4(),
      type: CdTypeEnum.OCTOPIPE,
      configurationData: '\xc30d04090302167b40fd4cf021e475d2c00e0134ba882788c0f717c4e8156c5bfc9af4d2f39161ec63fe76fba3031adfaf8dc2e0f09ffbc1e52e3e8c958f9239b7501392b245921705c432ffa106df82cfb8cb2b66012be01e87c5e6cb13ab3c4065892f3af09d7500dff9d48c664aed02bf2c73f4e8d536aafcf1ae86c55be2de4f1fc6ebfeba2d31e371c6c52d9ec0d7fc24ab83461a3c9c1e74d97a0112539a8720a9f58162423fd3019abbfa9d28e9e1c832dd5f6e530833e952188762b2ad7dee72a942ab388b2948e3c96fd19b2c625ecc43904502cbf420ed6586b59d',
      name: 'config-name',
      authorId: 'author'
    })

    const response = await request(app.getHttpServer()).post('/configurations/cd').send(cdConfiguration).set('x-circle-id', '12345')

    const responseObject = JSON.parse(response.text)
    expect(responseObject.message).toBe('Namespace already registered')
    expect(responseObject.statusCode).toBe(409)
  })

  it('/POST /cd should create cdconfiguration if namespace is not registered yet', async() => {

    const cdConfigurationData:IGenericConfig = {
      gitProvider: GitProvidersEnum.GITHUB,
      provider: ClusterProviderEnum.GENERIC,
      clientCertificate: 'cert-data',
      host: 'https://kube.cluster.com',
      gitToken: 'githubtoken',
      namespace: 'darwin',
      caData: 'ca-data',
      clientKey: 'client-key'
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
