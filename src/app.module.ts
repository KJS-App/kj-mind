import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KoreanPapersModule } from './korean-papers/korean-papers.module';

@Module({
  imports: [KoreanPapersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
