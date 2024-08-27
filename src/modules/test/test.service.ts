import { Injectable } from '@nestjs/common';
import { JobInterface } from '../../common/interfaces';

@Injectable()
export class TestService {
  async run(job: JobInterface, data: any): Promise<any> {
    return await job.execute(data);
  }
}
