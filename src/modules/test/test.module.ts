import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { FirstJob } from './jobs/first.job';
import { SecondJob } from './jobs/second.job';

@Module({
  providers: [TestService, FirstJob, SecondJob],
  exports: [TestService],
})
export class TestModule {}
