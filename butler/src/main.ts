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
import './tracer';
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
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as rTracer from 'cls-rtracer'
import {
  OctopipeEKSConfigurationDataSchema,
  OctopipeGenericConfigurationDataSchema,
  SpinnakerConfigurationDataSchema
} from './app/core/validations/schemas'
import { EntityNotFoundExceptionFilter } from './app/core/filters/entity-not-found-exception.filter'
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
  const options = new DocumentBuilder()
    .setTitle('Charles Butler')
    .setDescription('Charles butler documentation')
    .build()
  const document = SwaggerModule.createDocument(app, options)

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
  SwaggerModule.setup('/api/swagger', app, document)

  await app.listen(3000)
}

bootstrap()
