# Invoice OCR API

NestJS service that takes a **photo of a receipt** and returns the fields that matter —
**date** and **total amount paid** — instead of a wall of raw text.

## The idea

OCR engines disagree, cost money, and some of them need the cloud. So the engine sits behind
**one interface with two interchangeable implementations**:

| Engine | File | When |
|---|---|---|
| **AWS Textract** | `src/ocr/services/ocr-aws.service.ts` | Best accuracy on structured documents; walks Textract's `Relationships` / `BlockType` tree to rebuild lines and words. |
| **Tesseract** (local) | `src/ocr/services/ocr-tessract.service.ts` | No cloud, no credentials, no per-page cost. Runs with `lang: spa`, `oem: 1`, `psm: 11`. |

Swapping one for the other is a provider change in `OcrModule` — the controller never knows
which one answered.

## What it actually parses

Reading the text is the easy half. The useful half is **turning a locale-formatted string into a
number**: `1.234,56` and `1,234.56` are the same amount written by two countries. The service
derives both separators from `Intl.NumberFormat` for the target locale instead of hardcoding them.

Fields extracted today: issue date (regex over `dd-mm-yyyy` and its variants) and the total paid.

## API

```
POST /bills/file      multipart/form-data, field "file"
```

Guarded by a custom `FileSizeValidationPipe` before the upload ever reaches the OCR layer.
Swagger is mounted via `@nestjs/swagger` (`@ApiTags('Bills')`).

## Running it

```bash
npm install
cp .env-example .env     # AWS region / credentials, only needed for the Textract engine
npm run start:dev
```

There is a `Dockerfile` for the containerized run.

## Honest status

This is a **working prototype, not a product**. The Textract client in `ocr-aws.service.ts` is
wired but commented out, and the service resolves against sample payloads in `src/ocr/_mock/` so
the parsing logic can be exercised without burning AWS calls. The Tesseract path runs for real.

Stack: TypeScript · NestJS · `@aws-sdk/client-textract` · `node-tesseract-ocr` · Joi · Swagger · Docker
