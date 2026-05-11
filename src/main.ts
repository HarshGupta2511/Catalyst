import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strips fields not in DTO
      forbidNonWhitelisted: true, // throws error if extra fields sent
      transform: true,        // auto-converts types
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();