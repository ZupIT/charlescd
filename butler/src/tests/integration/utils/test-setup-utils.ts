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
