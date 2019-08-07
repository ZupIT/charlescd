import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import * as consul from "consul";

async function bootstrap() {
  const config = { baseUrl: `${process.env.CONSUL}/v1` };

  await consul(config).kv.get(`config/${process.env.MODULE}/data`, async (err, item) => {
    if (err) {
      throw new Error("Fail to load consul, verify the consul server.");
    }

    if (!item) {
      throw new Error("Fail to load config from url.");
    }

    console.log(item.Value)

    const app = await NestFactory.create(AppModule);
  
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true
      })
    );
  
    await app.listen(3000);
  });

}

bootstrap();
