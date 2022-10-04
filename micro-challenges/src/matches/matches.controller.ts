import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.interface';
import { MatchesService } from './matches.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  private readonly logger = new Logger(MatchesController.name);

  @EventPattern('create-match')
  async createMatch(@Payload() match: Match, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`match: ${JSON.stringify(match)}`);
      await this.matchesService.createMatch(match);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
