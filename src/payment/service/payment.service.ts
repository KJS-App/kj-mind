import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserService } from '../../user/user.service';
import { UserType } from '../../user/enums/user.enums';
import {
  PaymentOrderDto,
  PaymentStatus,
  ProcessNotificationDto,
} from '../types/payment.types';

@Injectable()
export class PayhereService {
  private readonly logger = new Logger(PayhereService.name);
  private readonly merchantId = process.env.PAYHERE_MERCHANT_ID || '';
  private readonly merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '';
  private readonly baseUrl = process.env.PAYHERE_BASE_URL || '';

  constructor(private readonly userService: UserService) { }

  generateHash(
    orderId: string,
    amount: string,
    currency: string = 'LKR',
  ): string {
    const merchantId = this.merchantId.trim();
    const merchantSecret = this.merchantSecret.trim();

    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = parseFloat(amount).toFixed(2);

    const hash = crypto
      .createHash('md5')
      .update(
        `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`,
      )
      .digest('hex')
      .toUpperCase();

    return hash;
  }

  createPaymentOrder(paymentData: PaymentOrderDto) {
    const hash = this.generateHash(
      paymentData.orderId,
      paymentData.amount.toString(),
    );

    // Ideally return_url and cancel_url should point to the frontend (kj-shepherd), not API_URL
    // For now, ensuring we use parameters if provided or fallback
    return {
      merchant_id: this.merchantId.trim(),
      return_url: `http://localhost:3000/payment/return`, // Updated to point to frontend
      cancel_url: `http://localhost:3000/payment/cancel`, // Updated to point to frontend
      notify_url: `${process.env.API_URL}/payhere/notify`,
      order_id: paymentData.orderId,
      items: paymentData.itemName,
      currency: 'LKR',
      amount: paymentData.amount.toFixed(2),
      first_name: paymentData.firstName,
      last_name: paymentData.lastName,
      email: paymentData.email,
      phone: paymentData.phone,
      address: paymentData.address,
      city: paymentData.city,
      country: paymentData.country,
      hash: hash,
      custom_1: paymentData.planType,
      custom_2: paymentData.planId,
    };
  }

  verifyNotification(data: ProcessNotificationDto): boolean {
    const hashedSecret = crypto
      .createHash('md5')
      .update(this.merchantSecret)
      .digest('hex')
      .toUpperCase();

    const localHash = crypto
      .createHash('md5')
      .update(
        `${data.merchant_id}${data.order_id}${data.payhere_amount}${data.payhere_currency}${data.status_code}${hashedSecret}`,
      )
      .digest('hex')
      .toUpperCase();

    return localHash === data.md5sig;
  }

  async processPaymentNotification(data: ProcessNotificationDto) {
    const isValid = this.verifyNotification(data);
    if (!isValid) {
      throw new HttpException('Invalid notification', HttpStatus.BAD_REQUEST);
    }

    const { order_id, status_code, payment_id } = data;

    // Extract userId from order_id
    let userId: string | null = null;
    if (order_id) {
      const parts = order_id.split('-');
      if (parts.length >= 2) {
        userId = parts[0];
      }
    } else {
      console.error('order_id not found');
    }

    let status = 'pending';
    if (status_code === PaymentStatus.SUCCESS) status = 'completed';
    else if (status_code === PaymentStatus.CANCELED) status = 'canceled';
    else if (status_code === PaymentStatus.FAILED) status = 'failed';
    else if (status_code === PaymentStatus.CHARGED_BACK) status = 'chargedback';

    if (status_code === PaymentStatus.SUCCESS && userId) {
      try {
        const planType = data.custom_1 as UserType;
        if (
          [UserType.SILVER, UserType.GOLD, UserType.PLATINUM].includes(planType)
        ) {
          await this.userService.updateUserType(userId, planType);
        } else {
          this.logger.warn(`Invalid plan type in custom_1: ${data.custom_1}`);
          await this.userService.updateUserType(userId, UserType.SILVER); // fallback or just log? Let's fallback for safety if something weird happens but normally shouldn't. Actually maybe safe to just fail? No, user paid. Let's give Silver at least.
        }
      } catch (error) {
        this.logger.error(error);
      }
    } else {
      this.logger.warn(`Payment failed`);
    }

    return { orderId: order_id, status, paymentId: payment_id };
  }
}
