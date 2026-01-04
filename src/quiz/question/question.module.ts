import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../firebase/firebase.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [FirebaseModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
