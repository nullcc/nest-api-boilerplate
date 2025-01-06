import { Controller, Get, Logger, Render } from '@nestjs/common';

import { Public } from '@modules/auth/decorators/route.decorator';

@Controller('')
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Public()
  @Get('')
  @Render('index')
  page() {
    return { name: 'nest api boilerplate' };
  }
}
