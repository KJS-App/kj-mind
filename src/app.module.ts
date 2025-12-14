import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UserModule } from './user/user.module';
import { VocabularyModule } from './features/vocabulary/vocabulary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FirebaseModule,
    AuthModule,
    UserModule,
    VocabularyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
