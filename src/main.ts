import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug']
  });
  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.enableVersioning({
    type: VersioningType.URI
  });

  const config = new DocumentBuilder()
    .setTitle('Bike Shop API')
    .setDescription('API for Managing Services by a Bike Shop')
    .setVersion('1.0')
    .addTag('bike')
    .addTag('client')
    .addTag('feedback')
    .addTag('mechanic')
    .addTag('service')
    .addTag('store')
    .addTag('part')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs-api', app, document);

  await app.listen(3000);
}
bootstrap();
