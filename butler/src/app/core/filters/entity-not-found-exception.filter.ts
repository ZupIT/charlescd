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

import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import { Response } from 'express'
import { ConsoleLoggerService } from '../logs/console'

/**
 * Custom exception filter to convert EntityNotFoundError from TypeOrm to NestJs responses
 * @see also @https://docs.nestjs.com/exception-filters
 */
@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly consoleLoggerService: ConsoleLoggerService) { }
  public catch(exception: EntityNotFoundError, host: ArgumentsHost): Response {

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    this.consoleLoggerService.error(JSON.stringify(exception.message))
    return response.status(404).json({ message: { statusCode: 404, error: 'Not Found', message: 'Entity not found' } })
  }
}
