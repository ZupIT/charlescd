import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as morgan from 'morgan'

async function bootstrap() {
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
