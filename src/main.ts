import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from '@shared/shared.module';
import { ConfigService } from '@shared/services/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/bad-request.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
      validationError: {
        target: false,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(reflector));

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     dismissDefaultMessages: true,
  //     validationError: {
  //       target: false,
  //     },
  //   }),
  // );

  const configService = app.select(SharedModule).get(ConfigService);
  const port = configService.getNumber('PORT');

  await app.listen(port);
  console.info(`server running on port ${port}`);
}

bootstrap();
