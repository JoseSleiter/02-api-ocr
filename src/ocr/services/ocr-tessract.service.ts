import { Injectable } from '@nestjs/common';
import * as tesseract from 'node-tesseract-ocr';
// https://github.com/tesseract-ocr/tesseract/blob/main/doc/tesseract.1.asc#LANGUAGES

@Injectable()
export class OcrService {
    config = {
        lang: 'spa',
        oem: 1,
        psm: 11,
    };
    regexWithLetter = /[0-9]{2}[-\\. ]{1,2}[0-9]{2}[-\\. ]{1,2}(19|20)[0-9]{2}/;
    regexForAnyCurrency = /\d+(?:[.,]\d{0,2})?/;
    TOTAL_AMOUNT_PAID = 'IMPORTO PAGATO';

    parseLocaleNumber(stringNumber, locale) {
        const thousandSeparator = Intl.NumberFormat(locale)
            .format(11111)
            .replace(/\p{Number}/gu, '');
        const decimalSeparator = Intl.NumberFormat(locale)
            .format(1.1)
            .replace(/\p{Number}/gu, '');

        return parseFloat(
            stringNumber
                .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
                .replace(new RegExp('\\' + decimalSeparator), '.'),
        );
    }

    parseReceipt(arrayText: Array<string>) {
        const itemsFound = [];
        const totalAmountPaid = [];
        for (const value of arrayText) {
            if (value.match(this.regexWithLetter)) {
                itemsFound.push({
                    item: value.split(this.regexWithLetter)[0].trim(),
                    value: value.match(this.regexWithLetter)[0].split(' ')[0]

                });
            }
            if (value.indexOf(this.TOTAL_AMOUNT_PAID) > -1) {
                totalAmountPaid.push({
                    item: this.TOTAL_AMOUNT_PAID,
                    value: this.parseLocaleNumber(
                        value.match(this.regexForAnyCurrency)[0],
                        'it',
                    ),
                });
            }
        }

        let totalItemsSum = 0;
        itemsFound.forEach(({ value }) => {
            totalItemsSum += value;
        });
        return {
            totalItemsSum,
            totalAmountPaid,
            itemsFound,
        };
    }

    parseImage(imageBuffer) {
        return tesseract
            .recognize(imageBuffer, this.config)
            .then((text) => {
                return text.split('\n');
                // return this.parseReceipt(text.split('\n'));
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }
}
