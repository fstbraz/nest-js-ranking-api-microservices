import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './../proxyrmq/proxyrmq.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
