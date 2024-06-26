import { AccountBasicList } from '../account/account-dto';

export interface InvoicePaymentPerson {
  id: number;
  credit_card_id: number;
  invoice_month_year: string;
  payment_account_id: number;
  payment_account_name: string;
  payment_account_image: string;
  payment_amount: number;
  payment_date: Date;
  payment_hour: string;
  attachment_name?: string;
}

export interface InvoicePaymentDialogData {
  accounts: AccountBasicList[];
  creditCardId: number;
  defaultPaymmentAccount: number;
  defaultPaymentAmount: number;
  monthYear: string;
  payment?: InvoicePaymentPerson;
  expireDate: Date;
}
