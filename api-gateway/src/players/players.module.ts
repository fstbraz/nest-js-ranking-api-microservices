import { Module } from '@nestjs/common';
import { AwsModule } from './../aws/aws.module';
import { ProxyRMQModule } from './../proxyrmq/proxyrmq.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
