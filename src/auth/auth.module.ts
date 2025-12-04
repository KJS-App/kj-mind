import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { AdminStrategy } from './strategies/admin.strategy';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [PassportModule, FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy, AdminStrategy],
})
export class AuthModule {}
