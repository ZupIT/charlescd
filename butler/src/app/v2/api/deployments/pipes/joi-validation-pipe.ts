
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

import { BadRequestException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import { CreateDeploymentValidator } from '../validations/create-deployment-validator'

@Injectable()
export class JoiValidationPipe implements PipeTransform {

  public transform(value: CreateDeploymentRequestDto) : CreateDeploymentRequestDto{
    const validator = new CreateDeploymentValidator(value)
    const validationResult = validator.validate()
    if (!validationResult.valid) {
      throw new BadRequestException(validator.formatErrors(validationResult.errors, HttpStatus.BAD_REQUEST))
    }

    return validationResult.data
  }
}
