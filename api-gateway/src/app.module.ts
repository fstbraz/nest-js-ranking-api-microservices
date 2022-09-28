import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ClientProxyRankingAPI } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    ProxyRMQModule,
    PlayersModule,
    CategoriesModule,
  ],
  providers: [ClientProxyRankingAPI],
})
export class AppModule {}
