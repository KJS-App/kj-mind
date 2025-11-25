import { Module } from '@nestjs/common';
import { KoreanPapersController } from './korean-papers.controller';

@Module({
  controllers: [KoreanPapersController]
})
export class KoreanPapersModule {}
