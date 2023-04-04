import { Controller, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileSizeValidationPipe } from '../../../bills/pipe/file-size-validation.pipe';
import { OcrService } from '../../../ocr/services/ocr.service';
import { AppService } from '../../app.service';

@ApiTags('Bills')
@ApiBearerAuth()
@Controller('bills')
export class BillsController {
    constructor(
        private readonly appService: AppService,
        private readonly ocrService: OcrService,
    ) { }

    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
    getHello(@UploadedFile(
        // new ParseFilePipeBuilder()
        //     .addFileTypeValidator({
        //         fileType: 'jpg2',
        //     })
        //     .build(),
        new FileSizeValidationPipe(),
    ) file: Express.Multer.File): any {
        console.log(file);
        return this.ocrService.parseImage(file.buffer);

    }
}
