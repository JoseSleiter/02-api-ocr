import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import awsConfig from '../config/aws.config';
import { OcrService } from './services/ocr-aws.service';

@Module({
  imports: [ConfigModule.forFeature(awsConfig)],
  providers: [OcrService],
  exports: [OcrService]
})
export class OcrModule { }
