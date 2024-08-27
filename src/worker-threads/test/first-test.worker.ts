import { NestFactory } from '@nestjs/core';
import { workerData, parentPort } from 'worker_threads';
import { AppModule } from '../../app.module';
import { TestService } from '../../modules/test/test.service';
import { FirstJob } from '../../modules/test/jobs/first.job';
import { TestModule } from 'src/modules/test/test.module';
import { ParamsInterface } from 'src/modules/test/interfaces/params.interface';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const testService = app.get(TestService);
  const firstJob = app.select(TestModule).get(FirstJob);

  const params: ParamsInterface = workerData;

  const data = await testService.run(firstJob, params);
  parentPort.postMessage(data);
}

run();
