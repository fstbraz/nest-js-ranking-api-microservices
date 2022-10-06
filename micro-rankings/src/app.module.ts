import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    RankingsModule,
    ProxyRMQModule,
  ],
})
export class AppModule {}
