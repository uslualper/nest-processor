import { NestFactory } from '@nestjs/core';
import { workerData, parentPort } from 'worker_threads';
import { AppModule } from '../../app.module';
import { TestService } from '../../modules/test/test.service';
import { SecondJob } from '../../modules/test/jobs/second.job';
import { TestModule } from 'src/modules/test/test.module';
import { ParamsInterface } from 'src/modules/test/interfaces/params.interface';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const testService = app.get(TestService);
  const secondJob = app.select(TestModule).get(SecondJob);

  const params: ParamsInterface = workerData;

  const data = await testService.run(secondJob, params);
  parentPort.postMessage(data);
}

run();
