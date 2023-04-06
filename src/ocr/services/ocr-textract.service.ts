import { Injectable } from '@nestjs/common';
import * as textract from 'textract';

@Injectable()
export class OcrService {

    parseImage(imageBuffer) {
        return new Promise((sol, rej) => {
            textract.fromBufferWithMime('image/jpeg', imageBuffer, function (error, text) {
                if (error)
                    rej(error)

                sol(text.split(' '))
            })
        })
    }
}
