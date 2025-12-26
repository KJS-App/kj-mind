export interface PaymentOrderDto {
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
}

export interface PaymentNotificationDto {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
}

export enum PaymentStatus {
  SUCCESS = '2',
  PENDING = '0',
  FAILED = '-1',
  CANCELED = '-2',
  CHARGED_BACK = '-3',
}

export interface ProcessNotificationDto {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: PaymentStatus;
  md5sig: string;
  custom_1?: string;
  custom_2?: string;
  method?: string;
  status_message?: string;
  card_holder_name?: string;
  card_no?: string;
  card_expiry?: string;
  payment_id?: string;
  recurring?: string;
  item_number?: number;
  item_name?: string;
  subscription_id?: string;
}
