import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUpSession } from './commons/config/init.session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  setUpSession(app);
  await app.listen(3000);
}
bootstrap();
