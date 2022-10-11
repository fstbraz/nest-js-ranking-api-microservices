import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);

  async uploadFile(file: any, id: string) {
    try {
      const s3 = new AWS.S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_S3_KEY,
        secretAccessKey: process.env.AWS_S3_KEY,
      });

      const fileExtension = file.originalname.split('.')[1];

      const urlKey = `${id}.${fileExtension}`;
      this.logger.log(`urlKey: ${urlKey}`);

      const params = {
        Body: file.buffer,
        Bucket: process.env.AWS_S3_BUCKET,
        Key: urlKey,
      };

      const result = await s3.putObject(params).promise();
      this.logger.log(`result: ${JSON.stringify(result)}`);
      return {
        url: process.env.AWS_S3_BUCKET_URL + urlKey,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error.message;
    }
  }
}
