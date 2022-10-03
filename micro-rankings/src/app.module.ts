import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    RankingsModule,
    ProxyRMQModule,
  ],
})
export class AppModule {}
