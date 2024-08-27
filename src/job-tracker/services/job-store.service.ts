import { Injectable } from '@nestjs/common';
import { JobRunInterface } from '../interfaces/job-run.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobStateInterface } from '../interfaces/job-state.interface';
import { JobStateType } from '../constants/job.const';

@Injectable()
export class JobStoreService {

    constructor(
        @InjectModel("JobRun")
        private readonly jobRunModel: Model<JobRunInterface>,
        @InjectModel("JobState")
        private readonly jobStateModel: Model<JobStateInterface>,
    ) {}


  async getJobState(jobName: string): Promise<JobStateType> {
    const result = await this.jobStateModel.findOne({ jobName });
    return result ? result.state : JobStateType.PENDING;
  }

  async setJobState(jobName: string, state: JobStateType, nextRun: Date): Promise<void> {
    await this.jobStateModel.updateOne(
      { jobName },
      {
        $set: {
          state,
          lastRun: new Date(),
          nextRun,
        },
      },
      { upsert: true },
    );
  }

  async addRun(jobName: string, startAt: Date, endAt: Date): Promise<void> {
    const duration = endAt.getTime() - startAt.getTime();
    await this.jobRunModel.create({
      jobName,
      startedAt: startAt,
      endAt: endAt,
      duration: duration,
    });
  }
}