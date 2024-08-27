import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class JobRun {
  @Prop({ required: true })
  jobName: string;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ required: true })
  duration: number; // Duration in milliseconds

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const JobRunSchema = SchemaFactory.createForClass(JobRun);
