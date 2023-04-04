import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000

  const listener = await app.listen(port);
  console.log('Listening on port ' + listener.address().port);
}
bootstrap();
