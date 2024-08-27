import { Injectable, Logger } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { JobStoreService } from './job-tracker/services/job-store.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { WorkerInterface } from './common/interfaces/worker.interface';
import { JobStateType } from './job-tracker/constants/job.const';
import { NotifyService } from './common/notify/notify.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private workerDir = __dirname + '/worker-threads';
  private jobs: { [key: string]: CronJob } = {};

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private jobStoreService: JobStoreService,
    private notifyService: NotifyService,
  ) {}

  run(workers: WorkerInterface[]): void {
    for (const worker of workers) {
      this.addCronJob(worker);
    }
  }

  addCronJob(worker: WorkerInterface) {
    const job = new CronJob(worker.cronTime, async () => {
      this.logger.log(`START: job ${worker.name} started!`);
      try {
        await this.runWorker(worker);
        this.logger.log(`DONE: job ${worker.name} finished!`);
      } catch (error) {
        this.logger.error(`DONE: job ${worker.name} failed!`, error.stack, error.message);
      }
    });

    this.schedulerRegistry.addCronJob(worker.name, job);
    job.start();

    this.jobs[worker.name] = job;

    this.logger.verbose(
      `job ${worker.name} added to scheduler with cron time ${worker.cronTime}`,
    );
  }
 
  async runWorker(worker: WorkerInterface): Promise<void> {
    const startAt = new Date();
    const job = this.jobs[worker.name];
    const nextDate = job.nextDate().toJSDate();
  
    try {
      const jobState = await this.jobStoreService.getJobState(worker.name);
  
      if (jobState === JobStateType.RUNNING) {
        this.logger.warn(`Job ${worker.name} is already running`);
        //return;
      }

      await this.jobStoreService.setJobState(worker.name, JobStateType.RUNNING, nextDate);
      this.logger.verbose(`Running worker: ${worker.name}`);
  
      this.notifyService.sendNotify(`INFO: Running worker: ${worker.name}`);

      const newWorker = new Worker(`${this.workerDir}/${worker.path}.worker.js`, {
        workerData: worker.data,
      });
  
      const service = this;
  
      newWorker.on('message', service.onWorkerMessage(worker.name, startAt, nextDate));
      newWorker.on('error', service.onWorkerError(worker.name, nextDate));
      newWorker.on('exit', service.onWorkerExit(worker.name, nextDate));
  
    } catch (error) {
      this.notifyService.sendNotify(`ERROR: Error running worker ${worker.name}: ${error.message}`);
      this.logger.error(`Error running worker ${worker.name}: ${error.message}`);
      await this.jobStoreService.setJobState(worker.name, JobStateType.FAILED, nextDate);
    }
  }
  
  private onWorkerMessage(workerName: string, startAt: Date, nextDate: Date): (msg: any) => void {
    const service = this;
    return async (msg: any) => {
      this.notifyService.sendNotify(`DONE: Worker message: ${msg}, worker: ${workerName}`);
      service.logger.debug(`Worker message: ${msg}, worker: ${workerName}`);
      await service.jobStoreService.setJobState(workerName, JobStateType.COMPLETED, nextDate);
      await service.jobStoreService.addRun(workerName, startAt, new Date());
    };
  }
  
  private onWorkerError(workerName: string, nextDate: Date): (err: Error) => void {
    const service = this;
    return (err: Error) => {
      this.notifyService.sendNotify(`ERROR: Worker error: ${err.message}, worker: ${workerName}`);
      service.logger.error(`Worker error: ${err.message}, worker: ${workerName}`);
      service.jobStoreService.setJobState(workerName, JobStateType.FAILED, nextDate);
    };
  }
  
  private onWorkerExit(workerName: string, nextDate: Date): (code: number) => void {
    const service = this;
    return (code: number) => {
      this.notifyService.sendNotify(`ERROR: Worker stopped with exit code ${code}, worker name: ${workerName}`);
      if (code !== 0) {
        service.logger.error(`Worker stopped with exit code ${code}, worker name: ${workerName}`);
        service.jobStoreService.setJobState(workerName, JobStateType.FAILED, nextDate);
      } else {
        service.logger.debug(`Worker stopped with exit code ${code}: worker name: ${workerName}`);
        service.jobStoreService.setJobState(workerName, JobStateType.COMPLETED, nextDate);
      }
    };
  }
  
}

