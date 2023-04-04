import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillsController } from './controllers/bills/bills.controller';
import { BillsModule } from '../bills/bills.module';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [BillsModule, OcrModule],
  controllers: [AppController, BillsController],
  providers: [AppService],
})
export class AppModule { }
