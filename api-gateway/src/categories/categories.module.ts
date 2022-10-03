import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './../proxyrmq/proxyrmq.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
