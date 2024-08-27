import { Types } from 'mongoose';
import { JobStateType } from '../constants/job.const';

export interface JobRunInterface {
  _id: Types.ObjectId;
  jobName: string;
  startedAt: Date;
  endAt: Date;
  duration: number; // Duration in milliseconds
  createdAt: Date;
  updatedAt: Date;
}
