import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

// https://docs.nestjs.com/techniques/task-scheduling

@Injectable()
export class HealthScheduler {
  constructor(private readonly logger: Logger) {}

  // * * * * * *
  // | | | | | |
  // | | | | | day of week
  // | | | | months
  // | | | day of month
  // | | hours
  // | minutes
  // seconds (optional)
  // @Cron('*/10 * * * * *')
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.debug('Called every 10 seconds');
  }
}
