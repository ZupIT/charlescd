import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { DynamicModule, INestApplication, ValidationPipe } from '@nestjs/common'
import { AppConstants } from './app/core/constants'
import * as morgan from 'morgan'
import * as hpropagate from 'hpropagate'

async function bootstrap() {

  hpropagate({
    setAndPropagateCorrelationId: false,
    headersToPropagate: [
      AppConstants.DEFAULT_CIRCLE_HEADER_NAME
    ]
  })

  const appModule: DynamicModule = await AppModule.forRootAsync()
  const app: INestApplication = await NestFactory.create(appModule)

  app.use(morgan('dev'))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  await app.listen(3000)
}

bootstrap()
