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

import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { MetadataScopeEnum } from '../enums/metadata-scope.enum'
import { BadRequestException } from '@nestjs/common'
import { Metadata } from '../interfaces/deployment.interface'


@ValidatorConstraint({ name: 'metadataSizeValidation', async: false })
export class MetadataSizeValidation implements ValidatorConstraintInterface {

  public validate(metadata: Metadata): boolean {
    if (!metadata) {
      return true
    }
    if (metadata.scope == MetadataScopeEnum.APPLICATION || metadata.scope == MetadataScopeEnum.CLUSTER) {
      const invalidMetadata = Object.keys(metadata.content).map(
        key => this.isValidKeyAndValue(key, metadata.content[key])
      ).filter(valid => !valid)

      return  Object.keys(metadata.content).length > 0 && invalidMetadata.length === 0
    } else {
      throw new BadRequestException('Invalid metadata scope')
    }
  }

  private isValidKeyAndValue(key: string, value: string): boolean {
    return this.isValidLength(key, 63) && this.isValidLength(value, 253)
  }

  private isValidLength(key: string, maxLength: number): boolean {
    return key.length  > 0 && key.length < maxLength
  }

  public defaultMessage() : string {
    return 'Metadata Key size must be between 1 and 63 and  Metadata value size must be between 1 and 253'
  }
}