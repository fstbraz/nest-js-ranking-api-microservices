import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './../proxyrmq/proxyrmq.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({
  imports: [ProxyRMQModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
