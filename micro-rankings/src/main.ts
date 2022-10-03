import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL],
      noAck: false,
      queue: process.env.RANKINGS_QUEUE,
    },
  });

  await app.listen();
}
bootstrap();
