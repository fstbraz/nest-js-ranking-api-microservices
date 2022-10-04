import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchesModule } from './matches/matches.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ProxyRMQModule,
    MatchesModule,
    ChallengesModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
