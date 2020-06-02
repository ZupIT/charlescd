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

import { INestApplication, UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { EntityNotFoundExceptionFilter } from '../../../app/core/filters/entity-not-found-exception.filter'
import { TestingModuleBuilder } from '@nestjs/testing'
import { ConsoleLoggerService } from '../../../app/core/logs/console'
import { AppConstants } from '../../../app/core/constants'

export class TestSetupUtils {

    public static async createApplication(module: TestingModuleBuilder): Promise<INestApplication> {
        try {
            const app: INestApplication = await NestFactory.create(module, { logger: false })
            const consoleLoggerService: ConsoleLoggerService = app.get<ConsoleLoggerService>(ConsoleLoggerService)

            app.useGlobalFilters(new EntityNotFoundExceptionFilter(consoleLoggerService))
            app.useGlobalPipes(
                new ValidationPipe({
                    transform: true,
                    whitelist: true,
                    exceptionFactory: (errors: ValidationError[]) => {
                        return new UnprocessableEntityException(errors)
                    }
                })
            )
            await app.init()
            return app
        } catch (error) {
            throw new Error(`ERROR: Could not boot nestjs application: ${error}`)
        }
    }

    public static seApplicationConstants(): void {
        AppConstants.ENCRYPTION_KEY = 'jest-test-aes-key'
    }
}
