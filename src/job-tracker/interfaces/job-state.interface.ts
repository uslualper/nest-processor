import { Types } from 'mongoose';
import { JobStateType } from '../constants/job.const';

export interface JobStateInterface {
  _id: Types.ObjectId;
  jobName: string;
  state: JobStateType;
  lastRun: Date;
  nextRun: Date;
  createdAt: Date;
  updatedAt: Date;
}
