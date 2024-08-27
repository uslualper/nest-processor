import { Module } from '@nestjs/common';
import { JobStoreService } from './services/job-store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobRunSchema } from './schemas/job-run.schema';
import { JobStateSchema } from './schemas/job-state.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "JobRun", schema: JobRunSchema },
            { name: "JobState", schema: JobStateSchema}
        ]),
    ],
    providers: [JobStoreService],
    exports: [JobStoreService],
})
export class JobTrackerModule {}
