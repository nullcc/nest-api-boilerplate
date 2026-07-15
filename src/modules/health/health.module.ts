import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { HealthScheduler } from './health.scheduler';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [Logger, HealthScheduler],
})
export class HealthModule {}
