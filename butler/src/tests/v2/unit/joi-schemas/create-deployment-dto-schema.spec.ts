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
import { CreateModuleDeploymentDto } from '../../../../app/v2/api/deployments/dto/create-module-request.dto'
import { DeploymentStatusEnum } from '../../../../app/v2/api/deployments/enums/deployment-status.enum'
import { CreateDeploymentValidator, JsonAPIError } from '../../../../app/v2/api/deployments/validations/create-deployment-validator'

it('Returns valid DTO object when params are valid', () => {
  const params = {
    deploymentId: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    defaultCircle: false,
    circle: {
      headerValue: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60'
    },
    modules: [
      {
        moduleId: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
        helmRepository: 'http://fake-repo/repos/charlescd-fake/helm-chart',
        components: [
          {
            componentId: 'a82f9bbb-169b-4b11-b48f-7f4fc7561651',
            buildImageUrl: 'hashicorp/http-echo',
            buildImageTag: 'latest',
            componentName: 'abobora'
          },
          {
            componentId: 'a82f9bbb-169b-4b11-b48f-7f4fc7561651',
            buildImageUrl: 'hashicorp/http-echo',
            buildImageTag: 'latest',
            componentName: 'jilo'
          }
        ]
      }
    ],
    authorId: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    cdConfigurationId: 'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    callbackUrl: 'http://fake-repo/deploy/notifications/deployment'
  }
  const validator = new CreateDeploymentValidator(params).validate()
  const expectedDto = new CreateDeploymentRequestDto(
    'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    'http://fake-repo/deploy/notifications/deployment',
    'ad2a1669-34b8-4af2-b42c-acbad2ec6b60',
    new CreateCircleDeploymentDto('ad2a1669-34b8-4af2-b42c-acbad2ec6b60'),
    DeploymentStatusEnum.CREATED,
    [
      new CreateModuleDeploymentDto(
        '',
        'http://fake-repo/repos/charlescd-fake/helm-chart',
        [
          new CreateComponentRequestDto('a82f9bbb-169b-4b11-b48f-7f4fc7561651', 'hashicorp/http-echo', 'latest', 'abobora', undefined, undefined),
          new CreateComponentRequestDto('a82f9bbb-169b-4b11-b48f-7f4fc7561651', 'hashicorp/http-echo', 'latest', 'jilo', undefined, undefined),
        ]
      )
    ],
    false
  )
  expect(validator).toEqual({ valid: true, data: expectedDto })
})

it('Formats the error to the JSON-API spec', () => {
  const params = {}
  const validator = new CreateDeploymentValidator(params)
  const validatorResult = validator.validate()
  if (validatorResult.valid) {
    fail('Should not be valid')
  }
  const formattedErrors = validator.formatErrors(validatorResult.errors, HttpStatus.BAD_REQUEST)
  const jsonApiError : JsonAPIError= {
    'errors': [
      {
        'status': HttpStatus.BAD_REQUEST,
        'detail': '"deploymentId" is required',
        'source': {
          'pointer': 'deploymentId'
        },
        'meta': {
          'component': 'butler',
          'timestamp': expect.anything()
        }
      },
      {
        'status': HttpStatus.BAD_REQUEST,
        'detail': '"defaultCircle" is required',
        'source': {
          'pointer': 'defaultCircle'
        },
        'meta': {
          'component': 'butler',
          'timestamp': expect.anything()
        }
      },
      {
        'status': HttpStatus.BAD_REQUEST,
        'detail': '"modules" is required',
        'source': {
          'pointer': 'modules'
        },
        'meta': {
          'component': 'butler',
          'timestamp': expect.anything()
        }
      },
      {
        'status': HttpStatus.BAD_REQUEST,
        'detail': '"authorId" is required',
        'source': {
          'pointer': 'authorId'
        },
        'meta': {
          'component': 'butler',
          'timestamp': expect.anything()
        }
      },
      {
        'status': HttpStatus.BAD_REQUEST,
        'detail': '"cdConfigurationId" is required',
        'source': {
          'pointer': 'cdConfigurationId'
        },
        'meta': {
          'component': 'butler',
          'timestamp': expect.anything()
        }
      },
      {
        'status': HttpStatus.BAD_REQUEST,
        'detail': '"callbackUrl" is required',
        'source': {
          'pointer': 'callbackUrl'
        },
        'meta': {
          'component': 'butler',
          'timestamp': expect.anything()
        }
      }
    ]
  }
  expect(formattedErrors).toEqual(jsonApiError)
})
