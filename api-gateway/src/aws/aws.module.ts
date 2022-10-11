import { Module } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsS3Service } from './aws-s3.service';

@Module({
  providers: [AwsS3Service, AwsCognitoService],
  exports: [AwsS3Service, AwsCognitoService],
})
export class AwsModule {}
