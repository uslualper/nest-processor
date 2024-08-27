import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { JobStateType } from '../constants/job.const';

@Schema({ timestamps: true })
export class JobState {
  @Prop({ required: true })
  jobName: string;

  @Prop({ enum: JobStateType, required: true })
  state: JobStateType;

  @Prop({ required: true })
  lastRun: Date;

  @Prop({ required: true })
  nextRun: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const JobStateSchema = SchemaFactory.createForClass(JobState);
