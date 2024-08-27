import { Injectable, Logger } from '@nestjs/common';
import { JobInterface } from '../../../common/interfaces/job.interface';
import { MurLock } from 'murlock';
import { ParamsInterface } from '../interfaces/params.interface';

@Injectable()
export class SecondJob implements JobInterface {
  private readonly logger = new Logger(SecondJob.name);

  @MurLock(60000, 'params.lockKey')
  async execute(params: ParamsInterface): Promise<number> {
    this.logger.verbose(`*SecondJob job maxCount: ${JSON.stringify(params)}`);
    return new Promise<number>((resolve) => {
      let count = 0;
      const interval = setInterval(() => {
        this.logger.log(`count: ${count}`);
        count++;
        if (count > params.maxCount) {
          clearInterval(interval);
          throw new Error('Error in second job');
          //resolve(count);
        }
      }, 1000);
    });
  }
}
