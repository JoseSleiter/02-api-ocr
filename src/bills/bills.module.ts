import { Module } from '@nestjs/common';
import { FileSizeValidationPipe } from './pipe/file-size-validation.pipe';

@Module({
    imports: [],
    providers: [FileSizeValidationPipe],
    exports: [FileSizeValidationPipe]
})
export class BillsModule { }
