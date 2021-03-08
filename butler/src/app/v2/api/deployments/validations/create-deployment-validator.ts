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

import { HttpStatus } from '@nestjs/common'
import { ValidationError } from 'joi'
import { CreateCircleDeploymentDto } from '../dto/create-circle-request.dto'
import { CreateComponentRequestDto } from '../dto/create-component-request.dto'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import Joi = require('joi')
import { GitProvidersEnum } from '../../../core/configuration/interfaces'
import { CreateGitDeploymentDto } from '../dto/create-git-request.dto'

export interface JsonAPIError {
    errors: {
      status: HttpStatus
      detail: string
      source: {
        pointer: string
      }
      meta: {
        component: 'butler'
        timestamp: number
      }
    }[]
}

export class CreateDeploymentValidator {
  private params
  constructor(params: unknown) {
    this.params = params
  }

  public validate(): {valid: true, data: CreateDeploymentRequestDto} | {valid: false, errors: ValidationError} {
    const componentSchema = this.componentSchema()
    const schema = this.deploymentSchema(componentSchema)

    const validated = schema.validate(this.params, { abortEarly: false, allowUnknown: false })
    if (validated.error === undefined) {
      const dto = this.createDto(validated)
      return { valid: true, data: dto }
    }
    return { valid: false, errors: validated.error }
  }

  public formatErrors(error: ValidationError, statusCode: HttpStatus) : JsonAPIError {
    return {
      errors: error.details.flatMap(d => {
        return {
          detail: d.message,
          meta: {
            component: 'butler',
            timestamp: Date.now()
          },
          source: {
            pointer: d.path.join('/')
          },
          status: statusCode
        }
      })
    }
  }

  private createDto(validated: Joi.ValidationResult) {
    const value = validated.value
    const components = value.components.map((c: CreateComponentRequestDto) => {
      return new CreateComponentRequestDto(
        c.componentId,
        c.buildImageUrl,
        c.buildImageTag,
        c.componentName,
        c.hostValue,
        c.gatewayName,
        c.helmRepository
      )
    })

    const dto = new CreateDeploymentRequestDto(
      value.deploymentId,
      value.authorId,
      value.callbackUrl,
      new CreateCircleDeploymentDto(value.circle.id, value.circle.default),
      DeploymentStatusEnum.CREATED,
      components,
      value.namespace,
      new CreateGitDeploymentDto(value.git.token, value.git.provider),
      value.timeoutInSeconds
    )
    return dto
  }

  private deploymentSchema(componentSchema: Joi.ObjectSchema<unknown>) {
    return Joi.object({
      deploymentId: Joi.string().guid().required(),
      namespace: Joi.string().required().max(255),
      circle: Joi.object({
        id: Joi.string().guid().required(),
        default: Joi.bool().required()
      }).required(),
      git: Joi.object({
        token: Joi.string().base64().trim().required(),
        provider: Joi.string().valid(GitProvidersEnum.GITHUB, GitProvidersEnum.GITLAB).required()
      }).required(),
      components: Joi.array().items(componentSchema).required().unique('componentName').label('components').min(1),
      authorId: Joi.string().guid().required(),
      callbackUrl: Joi.string().required().max(255),
      timeoutInSeconds: Joi.number().integer().min(5).optional()
    })
  }

  private componentSchema() {
    return Joi.object({
      componentId: Joi.string().guid().required().label('componentId'),
      buildImageUrl: Joi.string().required().max(255).regex(/^[a-zA-Z0-9][a-zA-Z0-9-.:/]*[a-zA-Z0-9]$/).max(253).label('buildImageUrl'),
      buildImageTag: Joi.string().required().max(255).label('buildImageTag'),
      componentName: Joi.string().required().max(255).label('componentName'),
      gatewayName: Joi.string().max(255).optional().label('gatewayName'),
      hostValue: Joi.string().max(255).optional().label('hostValue'),
      helmRepository: Joi.string().required().label('helmRepository')
    })
      .custom((obj, helper) => {
        const { buildImageTag, componentName } = obj
        if (buildImageTag.length + componentName.length > 63) {
          return helper.error('image.length')
        }
        return obj
      })
      .custom((obj, helper) => {
        const { buildImageTag, buildImageUrl } = obj
        const extractedTag = this.extractTag(buildImageTag, buildImageUrl)
        if (extractedTag !== buildImageTag) {
          return helper.error('imageTag.invalid')
        }
        return obj
      })
      .messages(
        {
          'image.length': 'Sum of lengths of componentName and buildImageTag cant be greater than 63',
          'imageTag.invalid': 'The tag suplied on the buildImageUrl must match the buildImageTag'
        }
      )
  }

  private extractTag(buildImageTag: string, buildImageUrl: string): string {
    const extractedTag = buildImageUrl.split(':')
    if (extractedTag.length === 1) {
      return buildImageTag
    }
    return extractedTag[extractedTag.length -1]
  }
}

