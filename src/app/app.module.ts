import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from "joi";

import { BillsModule } from '../bills/bills.module';
import { OcrModule } from '../ocr/ocr.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillsController } from './controllers/bills/bills.controller';
import { AWSConfigValidation } from 'src/config/aws.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ...AWSConfigValidation,
      }),
    }),
    BillsModule,
    OcrModule],
  controllers: [AppController, BillsController],
  providers: [AppService],
})
export class AppModule { }
