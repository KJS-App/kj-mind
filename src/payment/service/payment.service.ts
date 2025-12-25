import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { UserService } from '../../user/user.service';
import { UserType } from '../../user/enums/user.enums';

@Injectable()
export class PayhereService {
  private readonly logger = new Logger(PayhereService.name);
  private readonly merchantId = process.env.PAYHERE_MERCHANT_ID || '';
  private readonly merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '';
  private readonly baseUrl = process.env.PAYHERE_BASE_URL || ''; // sandbox or live

  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  // Generate hash for payment
  generateHash(
    orderId: string,
    amount: string,
    currency: string = 'LKR',
  ): string {
    const hashedSecret = crypto
      .createHash('md5')
      .update(this.merchantSecret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = parseFloat(amount).toFixed(2).replace(/\./, '');

    const hash = crypto
      .createHash('md5')
      .update(
        `${this.merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`,
      )
      .digest('hex')
      .toUpperCase();

    return hash;
  }

  // Create payment order
  async createPaymentOrder(paymentData: {
    userId: string;
    orderId: string;
    amount: number;
    itemName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }) {
    const hash = this.generateHash(
      paymentData.orderId,
      paymentData.amount.toString(),
    );

    return {
      merchantId: this.merchantId,
      orderId: paymentData.orderId,
      amount: paymentData.amount.toFixed(2),
      currency: 'LKR',
      hash: hash,
      itemName: paymentData.itemName,
      firstName: paymentData.firstName,
      lastName: paymentData.lastName,
      email: paymentData.email,
      phone: paymentData.phone,
      address: paymentData.address,
      city: paymentData.city,
      country: paymentData.country,
      returnUrl: `${process.env.API_URL}/payment/return`,
      cancelUrl: `${process.env.API_URL}/payment/cancel`,
      notifyUrl: `${process.env.API_URL}/payhere/notify`,
    };
  }

  verifyNotification(data: any): boolean {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = data;

    const hashedSecret = crypto
      .createHash('md5')
      .update(this.merchantSecret)
      .digest('hex')
      .toUpperCase();

    const localHash = crypto
      .createHash('md5')
      .update(
        `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`,
      )
      .digest('hex')
      .toUpperCase();

    return localHash === md5sig;
  }

  async processPaymentNotification(data: any) {
    const isValid = this.verifyNotification(data);
    if (!isValid) {
      throw new HttpException('Invalid notification', HttpStatus.BAD_REQUEST);
    }

    const { order_id, status_code, payment_id } = data;

    // Extract userId from order_id
    let userId:string | null = null;
    if (order_id) {
      const parts = order_id.split('_');
      if (parts.length >= 2) {
        userId = parts[0];
      }
    } else {
      console.error('order_id not found');
    }

    let status = 'pending';
    if (status_code === '2') status = 'completed';
    else if (status_code === '-1') status = 'canceled';
    else if (status_code === '-2') status = 'failed';
    else if (status_code === '-3') status = 'chargedback';

    if (status_code === '2' && userId) {
      try {
        await this.userService.updateUserType(userId, UserType.SILVER);
      } catch (error) {
        this.logger.error(error);
      }
    } else {
      this.logger.warn(`Payment failed`);
    }

    return { orderId: order_id, status, paymentId: payment_id };
  }
}
