import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as consul from 'consul'

async function consulBootstrap() {
  const config = { baseUrl: `${process.env.CONSUL}/v1` };

  await consul(config).kv.get(`config/${process.env.MODULE}/data`, async (err, item) => {
    if (err) {
      console.log('Fail to load consul, verify the consul server.')
      process.exit(1)
    }

    if (!item) {
      console.log('Fail to load config from url.')
      process.exit(1)
    }

    const consulEnvs = item.Value
  })
}

async function bootstrap() {
  
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true
      })
    )

    await app.listen(3000)

}

consulBootstrap()
bootstrap()
