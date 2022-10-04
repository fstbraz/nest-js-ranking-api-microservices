import { Module } from '@nestjs/common';
import { ClientProxyRankingAPI } from './client-proxy';

@Module({
  providers: [ClientProxyRankingAPI],
  exports: [ClientProxyRankingAPI],
})
export class ProxyRMQModule {}
