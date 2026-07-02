import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: true, // 400 on unknown fields
      transform: true, // coerce query-param strings to numbers etc.
    }),
  );

  app.enableCors({ origin: '*' }); // tighten before production

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Tu Vecino API → http://localhost:${port}`);
}
void bootstrap();
