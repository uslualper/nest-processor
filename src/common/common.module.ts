import { Global, Module } from '@nestjs/common';
import { NotifyService } from './notify/notify.service';

@Global()
@Module({
    providers: [NotifyService],
    exports: [NotifyService],
  })
export class CommonModule {}