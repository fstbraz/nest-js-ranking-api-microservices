import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AwsModule } from './../aws/aws.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [AwsModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
