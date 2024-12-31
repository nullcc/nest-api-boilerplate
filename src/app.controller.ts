import { Controller, Get, Logger, Render } from '@nestjs/common';

@Controller('')
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get('')
  @Render('index')
  page() {
    return { name: 'nest api boilerplate' };
  }
}
