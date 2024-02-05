import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';
import { lastValueFrom } from 'rxjs';
import { Account } from '../interfaces/Account';
import { GenericIdDs } from '../interfaces/Generic';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _http = inject(HttpClient);
  private _loginService = inject(LoginService);

  apiUrl = `${environment.baseApiUrl}accounts`;

  getByUser(): Promise<Account[]> {
    return lastValueFrom(
      this._http.get<Account[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<Account> {
    return lastValueFrom(this._http.get<Account>(`${this.apiUrl}/${id}`));
  }

  save(data: Account): Promise<Account> {
    data.userId = this._loginService.getLoggedUser!.id;

    return lastValueFrom(this._http.post<Account>(this.apiUrl, data));
  }

  adjustBalance(accountId: number, newBalance: number): Promise<Account> {
    let params = new HttpParams();
    params = params.append('newBalance', newBalance);

    return lastValueFrom(
      this._http.get<Account>(`${this.apiUrl}/adjust-balance/${accountId}`, {
        params,
      })
    );
  }

  getBasicList(): Promise<GenericIdDs[]> {
    return lastValueFrom(
      this._http.get<GenericIdDs[]>(`${this.apiUrl}/basic-list`)
    );
  }
}
