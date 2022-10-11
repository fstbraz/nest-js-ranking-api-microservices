import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('new-challenge-notification')
  async sendMailToChallenged(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`);
      await this.appService.sendMailToChallenged(challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
        return;
      }

      await channel.nack(originalMsg);
    }
  }
}
