import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as morgan from 'morgan'
import * as hpropagate from 'hpropagate'
import { AppConstants } from './app/core/constants'

async function bootstrap() {

  hpropagate({
    headersToPropagate: [
      AppConstants.DEFAULT_CIRCLE_HEADER_NAME
    ]
  })

  const app = await NestFactory.create(AppModule)

  app.use(morgan('dev'))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  await app.listen(3000)
}

bootstrap()
