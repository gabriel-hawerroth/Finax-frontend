import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UtilsService } from '../../../shared/utils/utils.service';
import { Account } from './account';
import { AccountBasicList } from './account-dto';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = `${environment.baseApiUrl}accounts`;

  constructor(
    private readonly _http: HttpClient,
    private readonly _utils: UtilsService
  ) {}

  getByUser(): Promise<Account[]> {
    return lastValueFrom(
      this._http.get<Account[]>(`${this.apiUrl}/get-by-user`)
    );
  }

  getById(id: number): Promise<Account> {
    return lastValueFrom(this._http.get<Account>(`${this.apiUrl}/${id}`));
  }

  getBasicList(): Promise<AccountBasicList[]> {
    return lastValueFrom(
      this._http.get<AccountBasicList[]>(`${this.apiUrl}/basic-list`)
    );
  }

  save(data: Account): Promise<Account> {
    data.userId = this._utils.getLoggedUser!.id;

    return lastValueFrom(this._http.post<Account>(this.apiUrl, data));
  }

  adjustBalance(accountId: number, newBalance: number): Promise<Account> {
    let params = new HttpParams();
    params = params.append('newBalance', newBalance);

    return lastValueFrom(
      this._http.post<Account>(
        `${this.apiUrl}/adjust-balance/${accountId}`,
        null,
        {
          params,
        }
      )
    );
  }
}
