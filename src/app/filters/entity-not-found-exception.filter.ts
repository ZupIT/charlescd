import { Catch, ExceptionFilter, ArgumentsHost} from '@nestjs/common'
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import { Response } from 'express'
import { ConsoleLoggerService } from '../core/logs/console'

/**
 * Custom exception filter to convert EntityNotFoundError from TypeOrm to NestJs responses
 * @see also @https://docs.nestjs.com/exception-filters
 */
@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly consoleLoggerService: ConsoleLoggerService) { }
  public catch(exception: EntityNotFoundError, host: ArgumentsHost) {

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    this.consoleLoggerService.error(JSON.stringify(exception.message))
    return response.status(404).json({ message: { statusCode: 404, error: 'Not Found', message: 'Entity not found' } })
  }
}
