import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from './../proxyrmq/proxyrmq.module';
import { RankingSchema } from './interfaces/ranking.schema';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ranking', schema: RankingSchema }]),
    ProxyRMQModule,
  ],
  providers: [RankingsService],
  controllers: [RankingsController],
})
export class RankingsModule {}
