import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
@Injectable()
export class ClientProxyRankingAPI {
  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.ADMIN_BE_QUEUE_URL],
        queue: process.env.ADMIN_BE_QUEUE,
      },
    });
  }
}
