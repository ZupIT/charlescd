/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { ExceptionBuilder } from '../../../core/utils/exception.utils'
import { ExecutionQuery } from '../dto/execution/paginated-execution-query.dto'
import * as Joi from 'joi'
import { ValidationError } from 'joi'



@Injectable()
export class JoiValidationExecutionPipe implements PipeTransform {

  public transform(value: ExecutionQuery) : ExecutionQuery {
    const validator = new ExecutionValidatorPipe(value)
    const validationErrors = validator.validate(value)
    if (validationErrors) {
      throw ExceptionBuilder.buildFromArray(validator.formatErrors(validationErrors, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST)
    }

    const sizeValue = Number.isInteger(parseInt(String(value.size))) ? parseInt(String(value.size)) : undefined
    const pageValue = Number.isInteger(parseInt(String(value.size))) ? parseInt(String(value.page)) : undefined
    return new ExecutionQuery(sizeValue, pageValue, value.current)
  }
}

class ExecutionValidatorPipe {
  public object: ExecutionQuery
  private schema: Joi.ObjectSchema<ExecutionQuery>;
  constructor(value: ExecutionQuery) {
    this.object = value
    this.schema = this.getSchema()
  }

  public getSchema(): Joi.ObjectSchema<ExecutionQuery> {
    return Joi.object({
      size: Joi.number().optional().min(1),
      page: Joi.number().optional().min(0),
      current: Joi.bool().optional()
    })
  }
  public validate(object: ExecutionQuery) {
    const validationResult: Joi.ValidationResult =  this.schema.validate(object, { abortEarly: false, allowUnknown: false })
    return validationResult.error
  }

  public formatErrors(error: ValidationError, statusCode: HttpStatus) : ExceptionBuilder[] {
    return error.details.flatMap(d => {
      return new ExceptionBuilder(d.message, statusCode).withSource(d.path.join('/'))
    })
  }
}
