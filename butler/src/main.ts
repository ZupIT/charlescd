import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import {
  DynamicModule,
  INestApplication,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe
} from '@nestjs/common'
import { AppConstants } from './app/core/constants'
import { registerSchema } from 'class-validator'
import * as morgan from 'morgan'
import * as hpropagate from 'hpropagate'
import * as rTracer from 'cls-rtracer'
import {
  OctopipeEKSConfigurationDataSchema,
  OctopipeGenericConfigurationDataSchema,
  SpinnakerConfigurationDataSchema
} from './app/core/validations/schemas'
import { EntityNotFoundExceptionFilter } from './app/filters/entity-not-found-exception.filter'
import { ConsoleLoggerService } from './app/core/logs/console'

async function bootstrap() {

  hpropagate({
    setAndPropagateCorrelationId: false,
    headersToPropagate: [
      AppConstants.DEFAULT_CIRCLE_HEADER_NAME
    ]
  })

  registerSchema(SpinnakerConfigurationDataSchema)
  registerSchema(OctopipeEKSConfigurationDataSchema)
  registerSchema(OctopipeGenericConfigurationDataSchema)

  const appModule: DynamicModule = await AppModule.forRootAsync()
  const app: INestApplication = await NestFactory.create(appModule)
  const logger = app.get<ConsoleLoggerService>(ConsoleLoggerService)
  app.use(morgan('dev'))
  app.use(morgan('X-Circle-Id: :req[x-circle-id]'))
  app.useGlobalFilters(new EntityNotFoundExceptionFilter(logger))
  app.use(rTracer.expressMiddleware())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors)
      }
    })
  )

  await app.listen(3000)
}

bootstrap()
