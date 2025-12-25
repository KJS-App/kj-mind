import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PayhereService } from './service/payment.service';
import { PayhereController } from './controller/payment.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [PayhereController],
  providers: [PayhereService],
})
export class PaymentModule {}
