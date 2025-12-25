import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { PayhereService } from '../service/payment.service';
import { RefreshAuthGuard } from 'src/auth/guards/refresh-auth/refresh-auth.guard';


@Controller('payhere')
export class PayhereController {
  constructor(private readonly payhereService: PayhereService) {}

  // @UseGuards(RefreshAuthGuard)
  @Post('create-order')
  async createOrder(@Body() orderData: any) {
    try {
      const paymentOrder = await this.payhereService.createPaymentOrder({
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
      return {
        success: false,
        message: error.message,
      };
    }
  }


  @Post('notify')
  async handleNotification(@Body() data: any) {
    try {
      const result = await this.payhereService.processPaymentNotification(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('verify')
  async verifyPayment(@Query('orderId') orderId: string) {
    // Implement order verification logic
    return { orderId, status: 'verified' };
  }
}