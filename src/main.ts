import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create a NestJS application using the Express platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 

  // Bảo vệ tự động bằng class validator
  app.useGlobalPipes(new ValidationPipe ({
    whitelist: true, // loại bỏ thuộc tính lạ, client nhét vào
    forbidNonWhitelisted: true, // ném lỗi khi có thuộc tính lạ
    transform: true
  }));

  // chỉ định thư mục chưa file tĩnh (css, js, hình ảnh)
  app.useStaticAssets(join (process.cwd(), 'public')); // process.cwd() trả về đường dẫn thư mục gốc của dự án, Nestjs ko cần vào folder dist

  // chỉ định thư mục chứa file template (hbs)
  app.setBaseViewsDir(join(process.cwd(), 'views'));

  // teamplate engine dùng là handlebars (hbs)
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
