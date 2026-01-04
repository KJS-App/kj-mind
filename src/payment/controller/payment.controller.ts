import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PayhereService } from '../service/payment.service';
import type {
  PaymentOrderDto,
  ProcessNotificationDto,
} from '../types/payment.types';

@Controller('payhere')
export class PayhereController {
  constructor(private readonly payhereService: PayhereService) {}

  // @UseGuards(RefreshAuthGuard)
  @Post('create-order')
  createOrder(@Body() orderData: PaymentOrderDto) {
    try {
      const paymentOrder = this.payhereService.createPaymentOrder({
        userId: orderData.userId,
        orderId: `${orderData.userId}_${Date.now()}`,
        amount: orderData.amount,
        itemName: orderData.itemName,
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        country: orderData.country,
      });

      return {
        success: true,
        data: paymentOrder,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message,
      };
    }
  }

  @Post('notify')
  async handleNotification(@Body() data: ProcessNotificationDto) {
    try {
      const result = await this.payhereService.processPaymentNotification(data);
      return { success: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message };
    }
  }

  @Get('verify')
  verifyPayment(@Query('orderId') orderId: string) {
    // Implement order verification logic
    return { orderId, status: 'verified' };
  }
}
