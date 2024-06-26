export interface CreditCard {
  id: number;
  user_id: number;
  name: string;
  card_limit: number;
  close_day: number;
  expires_day: number;
  image: string;
  standard_payment_account_id: number;
  active: boolean;
}
