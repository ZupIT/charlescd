import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as morgan from 'morgan'
import * as hpropagate from 'hpropagate'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  hpropagate({
    headersToPropagate: [
      'x-circle-id'
    ]
  })

  app.use(morgan('dev'))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  await app.listen(3000)
}

bootstrap()
