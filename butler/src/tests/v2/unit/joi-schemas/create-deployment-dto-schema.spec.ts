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

import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { CreateCircleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-circle-request.dto'
import { CreateComponentRequestDto } from '../../../../app/v2/api/deployments/dto/create-component-request.dto'
import { CreateDeploymentRequestDto } from '../../../../app/v2/api/deployments/dto/create-deployment-request.dto'
import { CreateGitDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-git-request.dto'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'
import { CreateDeploymentValidator } from '../../../../app/v2/api/deployments/validations/create-deployment-validator'
import { GitProvidersEnum } from '../../../../app/v2/core/configuration/interfaces'
import { UrlConstants } from '../../integration/test-constants'

it('Returns valid DTO object when params are valid', () => {
  const params = {
    deploymentId: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    circle: {
      id: 'ed3a2669-34b8-4af2-b42c-acbad2ec6b60',
      default: 'false'
    },
    git: {
      token: Buffer.from('abc123-token').toString('base64'),
      provider: GitProvidersEnum.GITHUB
    },
    namespace: 'namespace',
    components: [
      {
        helmRepository: UrlConstants.helmRepository,
        componentId: 'a82f9bbb-169b-4b11-b48f-7f4fc7561651',
        buildImageUrl: 'hashicorp/http-echo',
        buildImageTag: 'latest',
        componentName: 'abobora'
      },
      {
        helmRepository: UrlConstants.helmRepository,
        componentId: 'f22f9bbb-169b-4b11-b48f-7f4fc7561651',
        buildImageUrl: 'hashicorp/http-echo',
        buildImageTag: 'latest',
        componentName: 'jilo'
      }
    ],
    authorId: 'bc2a1669-34b8-4af2-b42c-acbad2ec6b60',
    callbackUrl: UrlConstants.deploymentCallbackUrl,
    timeoutInSeconds: 10,
    overrideCircle: true
  }
  const validator = new CreateDeploymentValidator(params).validate()
  const expectedDto = new CreateDeploymentRequestDto(
    'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    'bc2a1669-34b8-4af2-b42c-acbad2ec6b60',
    UrlConstants.deploymentCallbackUrl,
    new CreateCircleDeploymentDto('ed3a2669-34b8-4af2-b42c-acbad2ec6b60', false),
    DeploymentStatusEnum.CREATED,
    [
      new CreateComponentRequestDto(
        'a82f9bbb-169b-4b11-b48f-7f4fc7561651',
        'hashicorp/http-echo',
        'latest',
        'abobora',
        undefined,
        undefined,
        UrlConstants.helmRepository
      ),
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
    'namespace',
    new CreateGitDeploymentDto(expect.anything(), GitProvidersEnum.GITHUB),
    10,
    true
  )
  expect(validator).toEqual({ valid: true, data: expectedDto })
})

it('Formats the error to the correct format', () => {
  const params = {}
  const validator = new CreateDeploymentValidator(params)
  const validatorResult = validator.validate()
  if (validatorResult.valid) {
    fail('Should not be valid')
  }
  const formattedErrors = validator.formatErrors(validatorResult.errors, HttpStatus.BAD_REQUEST)
  const expectedErrors  = [
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"deploymentId" is required',
      'source': 'deploymentId'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"namespace" is required',
      'source': 'namespace'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"circle" is required',
      'source': 'circle'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"git" is required',
      'source': 'git'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"components" is required',
      'source': 'components'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"authorId" is required',
      'source': 'authorId'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"callbackUrl" is required',
      'source': 'callbackUrl'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': '"overrideCircle" is required',
      'source': 'overrideCircle'
    }
  ]
  expect(formattedErrors).toEqual(expectedErrors)
})

it('validate the tag for special characters ', () => {

  const encryptedToken =  `-----BEGIN PGP MESSAGE-----
ww0ECQMCcRYScW+NJZZy0kUBbjTidEUAU0cTcHycJ5Phx74jvSTZ7ZE7hxK9AejbNDe5jDRGbqSd
BSAwlmwpOpK27k2yXj4g1x2VaF9GGl//Ere+xUY=
=QGZf
-----END PGP MESSAGE-----) `
  const base64Token = Buffer.from(encryptedToken).toString('base64')
  const params ={
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
        buildImageTag: 'tag@invalid',
        componentName: 'component-name'
      },
      {
        helmRepository: UrlConstants.helmRepository,
        componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
        buildImageUrl: 'imageurl.com',
        buildImageTag: '-anothertaginvalid',
        componentName: 'component-name-2'
      },
      {
        helmRepository: UrlConstants.helmRepository,
        componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
        buildImageUrl: 'imageurl.com',
        buildImageTag: 'onemoretaginvalid-',
        componentName: 'component-name-3'
      },
      {
        helmRepository: UrlConstants.helmRepository,
        componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
        buildImageUrl: 'imageurl.com',
        buildImageTag: 'lastTagInvalid',
        componentName: 'component-name-4'
      },
      {
        helmRepository: UrlConstants.helmRepository,
        componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
        buildImageUrl: 'imageurl.com',
        buildImageTag: 'some-valid-tag-1',
        componentName: 'component-name-5'
      },

    ],
    authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
    callbackUrl: UrlConstants.deploymentCallbackUrl,
    overrideCircle: false
  }
  const validator = new CreateDeploymentValidator(params)
  const validatorResult = validator.validate()
  if (validatorResult.valid) {
    fail('Should not be valid')
  }
  const formattedErrors = validator.formatErrors(validatorResult.errors, HttpStatus.BAD_REQUEST)
  const expectedErrors  = [
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': 'tag must consist of lower case alphanumeric characters, "-" or ".", and must start and end with an alphanumeric character',
      'source': 'components/0'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': 'tag must consist of lower case alphanumeric characters, "-" or ".", and must start and end with an alphanumeric character',
      'source': 'components/1'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': 'tag must consist of lower case alphanumeric characters, "-" or ".", and must start and end with an alphanumeric character',
      'source': 'components/2'
    },
    {
      'status': HttpStatus.BAD_REQUEST,
      'title': 'tag must consist of lower case alphanumeric characters, "-" or ".", and must start and end with an alphanumeric character',
      'source': 'components/3'
    }
  ]
  expect(formattedErrors).toEqual(expectedErrors)
})
