import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';
import { MatchSchema } from './interfaces/match.schema';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
    ProxyRMQModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
