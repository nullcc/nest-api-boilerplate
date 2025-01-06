import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { HealthController } from './health.controller';
import { HealthScheduler } from './health.scheduler';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [Logger, HealthScheduler],
})
export class HealthModule {}
