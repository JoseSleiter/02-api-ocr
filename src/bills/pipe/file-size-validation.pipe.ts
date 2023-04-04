import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

const ONE_MB_IN_Kb = 1048576
const MAX_SIZE_PHOTO_MB = 2.1

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // "value" is an object containing the file's attributes and metadata
        const MAX_SIZE = MAX_SIZE_PHOTO_MB * ONE_MB_IN_Kb;
        if (value.size > MAX_SIZE) {
            throw new BadRequestException('Validation failed');
        }
        return value
    }
}