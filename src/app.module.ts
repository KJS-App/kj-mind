import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UserModule } from './user/user.module';

import { CategoryModule } from './quiz/quizcategory/category.module';
import { SubcategoryModule } from './quiz/quizsubcategory/subcategory.module';
import { QuestionModule } from './quiz/question/question.module';

import { PastpapersModule } from './pastpapers/pastpapers.module';
import { VocabularyModule } from './features/vocabulary/vocabulary.module';
import { PaymentModule } from './payment/payment.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FirebaseModule,
    AuthModule,
    UserModule,

    CategoryModule,
    SubcategoryModule,
    QuestionModule,

    PastpapersModule,
    VocabularyModule,
    PaymentModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
