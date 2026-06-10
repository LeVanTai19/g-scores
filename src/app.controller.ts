import { Controller, Get, Render } from '@nestjs/common';


@Controller()
export class AppController {

  // route: GET / (trang chủ)
  @Get()
  @Render('index') // Nestjs sẽ tìm file index.hbs trong thư mục views để render
  root() {
    return {};
  }
}
