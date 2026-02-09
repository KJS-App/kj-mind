export interface SubscriptionPricingDto {
  amount: number;
  currency: string;
}

export interface SubscriptionRulesDto {
  paper_slots: number;
  agent_credits: number;
}

export interface SubscriptionConfigDto {
  plan_name: string;
  weight: number;
  is_active: boolean;
  pricing: SubscriptionPricingDto;
  rules: SubscriptionRulesDto;
  user_type: string;
}

export interface CreateSubscriptionConfigDto {
  plan_name: string;
  weight: number;
  pricing: SubscriptionPricingDto;
  rules: SubscriptionRulesDto;
  user_type: string;
}

export interface UpdateSubscriptionConfigDto {
  plan_name?: string;
  weight?: number;
  is_active?: boolean;
  pricing?: SubscriptionPricingDto;
  rules?: SubscriptionRulesDto;
  user_type?: string;
}
