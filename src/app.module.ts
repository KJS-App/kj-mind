import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { QuestionModule } from './modules/question/question.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
