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
import { GitProvidersEnum } from '../../../core/configuration/interfaces'
import { CreateGitDeploymentDto } from '../dto/create-git-request.dto'
import { ExceptionBuilder } from '../../../core/utils/exception.utils'
import { MetadataScopeEnum } from '../enums/metadata-scope.enum'
import Joi = require('joi')
import { Metadata } from '../interfaces/deployment.interface'

export interface JsonAPIError {
    errors: {
      status: number
      detail?: string | undefined
      title: string
      source: {
        pointer: string | undefined
      }
      meta: {
        component: string
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

  public formatErrors(error: ValidationError, statusCode: HttpStatus) : ExceptionBuilder[] {
    return error.details.flatMap(d => {
      return new ExceptionBuilder(d.message, statusCode).withSource(d.path.join('/'))
    })
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
      value.timeoutInSeconds,
      value.metadata
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
        token: Joi.string().required(),
        provider: Joi.string().valid(GitProvidersEnum.GITHUB, GitProvidersEnum.GITLAB).required()
      }).required(),
      components: Joi.array().items(componentSchema).required().unique('componentName').label('components').min(1),
      authorId: Joi.string().guid().required(),
      callbackUrl: Joi.string().required().max(255),
      timeoutInSeconds: Joi.number().integer().min(5).optional(),
      metadata: Joi.allow(null).custom( (metadata, helper) => {
        if (!this.isValidMetadata(metadata)) {
          return helper.error('invalid.metadata')
        }
        if (!this.hasDnsFormat(metadata)){
          return helper.error('imageTag.dns.format')
        }
      }).messages(
        {
          'invalid.metadata' : 'Metadata Key size must be between 1 and 63 and  Metadata value size must be between 1 and 253',
          'imageTag.dns.format': 'Metadata key and value must consist of alphanumeric characters,' +
              ' "-" or ".", and must start and end with an alphanumeric character'
        }
      )
    })
  }

  private isValidMetadata(metadata: Metadata) {
    if (metadata.scope == MetadataScopeEnum.APPLICATION || metadata.scope == MetadataScopeEnum.CLUSTER) {
      const invalidMetadata = Object.keys(metadata.content).find(
        key => !this.isValidKeyAndValue(key, metadata.content[key])
      )
      return Object.keys(metadata.content).length > 0 && invalidMetadata == null
    } else {
      throw new ExceptionBuilder('Invalid metadata scope', HttpStatus.BAD_REQUEST).build()
    }
  }

  private componentSchema() {
    return Joi.object({
      componentId: Joi.string().guid().required().label('componentId'),
      buildImageUrl: Joi.string().required().max(255).regex(/^[a-zA-Z0-9][a-zA-Z0-9-.:/]*[a-zA-Z0-9]$/).max(253).label('buildImageUrl'),
      buildImageTag: Joi.string().required().max(255).label('buildImageTag'),
      componentName: Joi.string().required().max(255).label('componentName'),
      gatewayName: Joi.string().max(255).allow(null).optional().label('gatewayName'),
      hostValue: Joi.string().max(255).allow(null).optional().label('hostValue'),
      helmRepository: Joi.string().required().label('helmRepository')
    })
      .custom((obj, helper) => {

        const { buildImageTag, componentName } = obj

        if (!this.isValidDnsFormat(buildImageTag)) {
          return helper.error('imageTag.dns.format')
        }

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
          'imageTag.invalid': 'The tag suplied on the buildImageUrl must match the buildImageTag',
          'imageTag.dns.format': 'tag must consist of lower case alphanumeric characters, "-" or ".", and must start and end with an alphanumeric character'
        }
      )
  }
  
  private isValidDnsFormat(value: string) {
    const regExpr = new RegExp('[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*', 'g')
    const comparedValue = value.match(regExpr)?.join('-')
    return comparedValue === value
  }

  private extractTag(buildImageTag: string, buildImageUrl: string): string {
    const extractedTag = buildImageUrl.split(':')
    if (extractedTag.length === 1) {
      return buildImageTag
    }
    return extractedTag[extractedTag.length -1]
  }

  private isValidKeyAndValue(key: string, value: string): boolean {
    return this.isValidLength(key, 63) && this.isValidLength(value, 253)
  }

  private isValidLength(key: string, maxLength: number): boolean {
    return key.length  > 0 && key.length < maxLength
  }

  private hasDnsFormat(metadata: Metadata) {
    const invalidDnsMetadata = Object.keys(metadata.content).find(
      key => !this.isValidDnsFormat(key) || !this.isValidDnsFormat(metadata.content[key])
    )
    return invalidDnsMetadata == null
  }
}

