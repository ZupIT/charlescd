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
import * as http from 'http'
import { BadRequestException, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { CreateCircleDeploymentDto } from '../../../../../src/app/v2/api/deployments/dto/create-circle-request.dto'
import { CreateComponentRequestDto } from '../../../../../src/app/v2/api/deployments/dto/create-component-request.dto'
import { CreateDeploymentRequestDto } from '../../../../../src/app/v2/api/deployments/dto/create-deployment-request.dto'
import { CreateGitDeploymentDto } from '../../../../../src/app/v2/api/deployments/dto/create-git-request.dto'
import { GitProvidersEnum } from '../../../../../src/app/v2/core/configuration/interfaces'
import { K8sClient } from '../../../../../src/app/v2/core/integrations/k8s/client'
import { AppModule } from '../../../../app/app.module'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'
import { NamespaceValidationPipe } from '../../../../app/v2/api/deployments/pipes/namespace-validation.pipe'
import { FixtureUtilsService } from '../fixture-utils.service'
import { UrlConstants } from '../test-constants'
import { TestSetupUtils } from '../test-setup-utils'

describe('NamespaceValidationPipe', () => {
  let app: INestApplication
  let fixtureUtilsService: FixtureUtilsService
  let pipe: NamespaceValidationPipe
  let k8sClient: K8sClient
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
    pipe = app.get<NamespaceValidationPipe>(NamespaceValidationPipe)
    k8sClient = app.get<K8sClient>(K8sClient)
    TestSetupUtils.seApplicationConstants()
  })

  afterAll(async() => {
    await fixtureUtilsService.clearDatabase()
    await app.close()
  })

  beforeEach(async() => {
    await fixtureUtilsService.clearDatabase()
  })

  it('returns bad request error when trying to deploy into invalid namespace', async() => {

    jest.spyOn(k8sClient, 'getNamespace').mockImplementation( 
      async() => Promise.resolve({ body: {}, response: {} as http.IncomingMessage })
    )

    const req = new CreateDeploymentRequestDto(
      'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'bc2a1669-34b8-4af2-b42c-acbad2ec6b60',
      UrlConstants.deploymentCallbackUrl,
      new CreateCircleDeploymentDto('ed3a2669-34b8-4af2-b42c-acbad2ec6b60', false),
      DeploymentStatusEnum.CREATED,
      [
        new CreateComponentRequestDto(
          'f22f9bbb-169b-4b11-b48f-7f4fc7561651',
          'hashicorp/http-echo',
          'latest',
          'jilo',
          undefined,
          undefined,
          UrlConstants.helmRepository
        )
      ],
      'iaminvalid',
      new CreateGitDeploymentDto(expect.anything(), GitProvidersEnum.GITHUB),
      10
    )
    await expect(pipe.transform(req)).rejects.toThrow(new BadRequestException({}))
  })

  it('allows the operation to continue due valid namespace', async() => {

    jest.spyOn(k8sClient, 'getNamespace').mockImplementation( 
      async() => Promise.resolve({ 
        body: {
          status: {
            phase: 'Active'
          }
        }, 
        response: {} as http.IncomingMessage }
      )
    )

    const req = new CreateDeploymentRequestDto(
      'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'bc2a1669-34b8-4af2-b42c-acbad2ec6b60',
      UrlConstants.deploymentCallbackUrl,
      new CreateCircleDeploymentDto('ed3a2669-34b8-4af2-b42c-acbad2ec6b60', false),
      DeploymentStatusEnum.CREATED,
      [
        new CreateComponentRequestDto(
          'f22f9bbb-169b-4b11-b48f-7f4fc7561651',
          'hashicorp/http-echo',
          'latest',
          'jilo',
          undefined,
          undefined,
          UrlConstants.helmRepository
        )
      ],
      'iamvalid',
      new CreateGitDeploymentDto(expect.anything(), GitProvidersEnum.GITHUB),
      10
    )

    expect(await pipe.transform(req)).toEqual(req)
  })

})