import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  InvoiceMonthValues,
  InvoicePaymentSave,
  InvoiceValues,
} from '../interfaces/invoice';
import { InvoicePayment } from '../interfaces/invoice-payment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.baseApiUrl}invoice`;

  getMonthValues(
    creditCardId: number,
    selectedMonth: string
  ): Promise<InvoiceMonthValues> {
    let params = new HttpParams();
    params = params.append('creditCardId', creditCardId);
    params = params.append('selectedMonth', selectedMonth);

    return lastValueFrom(
      this._http.get<InvoiceMonthValues>(`${this.apiUrl}/get-month-values`, {
        params,
      })
    );
  }

  getValues(creditCardId: number): Promise<InvoiceValues> {
    let params = new HttpParams();
    params = params.append('creditCardId', creditCardId);

    return lastValueFrom(
      this._http.get<InvoiceValues>(`${this.apiUrl}/get-values`, { params })
    );
  }

  savePayment(payment: InvoicePayment): Promise<InvoicePayment> {
    return lastValueFrom(
      this._http.post<InvoicePayment>(`${this.apiUrl}/save-payment`, payment)
    );
  }

  saveAttachment(invoiceId: number, attachment: File): Promise<InvoicePayment> {
    const formData = new FormData();
    formData.append('attachment', attachment);

    return lastValueFrom(
      this._http.put<InvoicePayment>(
        `${this.apiUrl}/save-attachment/${invoiceId}`,
        formData
      )
    );
  }

  removeAttachment(invoiceId: number): Promise<InvoicePayment> {
    return lastValueFrom(
      this._http.delete<InvoicePayment>(
        `${this.apiUrl}/remove-attachment/${invoiceId}`
      )
    );
  }
}
