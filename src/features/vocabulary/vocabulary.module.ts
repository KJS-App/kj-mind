import { Module } from '@nestjs/common';
import { VocabularyController } from './controllers/vocabulary.controller';
import { VocabularyService } from './services/vocabulary.service';
import { FirebaseModule } from '../../firebase/firebase.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
