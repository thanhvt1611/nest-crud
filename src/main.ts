import { NestFactory } from '@nestjs/core';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { TransformInterceptor } from './shared/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Tự động loại bỏ các field không được khai báo decorator trong class DTO
      forbidNonWhitelisted: true, //Ném ra lỗi nếu có field không được khai báo decorator trong class DTO
      transform: true, //Tự động chuyển đổi plain JavaScript object thành instance của DTO class
      transformOptions: {
        enableImplicitConversion: true, //Chuyển đổi kiểu dữ liệu tự động
      },
      exceptionFactory: (validationErrors) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints ?? {}).join(', '),
          })),
        );
      },
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
