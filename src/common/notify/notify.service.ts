import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SlackService } from 'nestjs-slack';
import { NestConfig } from 'src/config';

@Injectable()
export class NotifyService {

    private logger = new Logger(NotifyService.name);

    private mode: string;
    private botName:string;

    constructor(
        configService: ConfigService,
        private slackService: SlackService,
    ){
        const nestConfig = configService.get<NestConfig>('nest');
        this.mode = nestConfig.mode;
        this.botName = nestConfig.name;
    }

    async sendNotify(text: string): Promise<void> {
        if (this.mode !== 'production') {
            this.logger.log(`Notify: ${text}`);
            return;
        }
        this.slackService.sendText(this.modifyText(text));
    }

    async sendNotifyToChannel(text: string, channel: string): Promise<void> {
        if (this.mode !== 'production') {
            this.logger.log(`Notify: ${text}`);
            return;
        }
        this.slackService.sendText(this.modifyText(text), {channel});
    }

    private modifyText(text: string): string {
        return `${text} [${this.botName.toUpperCase()}]`;
    }

}