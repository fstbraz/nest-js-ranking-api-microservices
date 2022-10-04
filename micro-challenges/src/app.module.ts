import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { MatchesModule } from './matches/matches.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [ProxyRMQModule, MatchesModule, ChallengesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
