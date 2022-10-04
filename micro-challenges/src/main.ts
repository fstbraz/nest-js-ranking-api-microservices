import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URL],
      noAck: false,
      queue: process.env.CHALLENGES_QUEUE,
    },
  });

  await app.listen();
}
bootstrap();
