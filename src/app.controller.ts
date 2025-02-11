import { Controller, Get, Logger, Render } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { Public } from '@modules/auth/decorators/route.decorator';

@Controller('')
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Public()
  @SkipThrottle({ short: true, medium: true }) // this route will skip "short" and "medium" rate limiting.
  @Get('')
  @Render('index')
  index() {
    return { name: 'nest api boilerplate' };
  }
}
