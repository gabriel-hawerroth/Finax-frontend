import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewRealeseCashFlowDialogComponent } from './components/new-realese-cash-flow-dialog/new-realese-cash-flow-dialog.component';
import {
  CashFlow,
  CashFlowFilters,
  MonthlyCashFlow,
  TotalsCashFlow,
} from '../../../interfaces/CashFlow';
import { CashFlowService } from '../../../services/cash-flow.service';
import { LoginService } from '../../../services/login.service';
import { CustomCurrencyPipe } from '../../../utils/customCurrencyPipe';
import { lastValueFrom } from 'rxjs';
import { Category } from '../../../interfaces/Category';
import { CategoryService } from '../../../services/category.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { ReleaseDetailsComponent } from './components/release-details/release-details.component';
import { Account } from '../../../interfaces/Account';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    CustomCurrencyPipe,
    MatBottomSheetModule,
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
})
export class CashFlowComponent implements OnInit {
  public utilsService = inject(UtilsService);
  private _fb = inject(FormBuilder);
  private _matDialog = inject(MatDialog);
  private _bottomSheet = inject(MatBottomSheet);
  private _cashFlowService = inject(CashFlowService);
  private _loginService = inject(LoginService);
  private _accountService = inject(AccountService);
  private _categoryService = inject(CategoryService);

  language = this.utilsService.getUserConfigs.language;
  currency = this.utilsService.getUserConfigs.currency;

  filterForm!: FormGroup;

  releases: MonthlyCashFlow[] = [];

  selectedDate: Date = new Date();
  selectedMonth: number = this.selectedDate.getMonth();
  selectedYear: number = this.selectedDate.getFullYear();

  currentYear: string = this.selectedDate.getFullYear().toString();

  searching: boolean = false;

  totals: TotalsCashFlow = {
    revenues: 0,
    expenses: 0,
    balance: 0,
  };

  accounts: Account[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.getReleases();

    this.getAccounts();
    this.getCategories();
  }

  buildForm() {
    this.filterForm = this._fb.group({
      account: '',
    });
  }

  getReleases() {
    this.searching = true;

    const filters: CashFlowFilters = {
      userId: this._loginService.getLoggedUserId,
      month: this.selectedMonth + 1,
      year: this.selectedYear,
    };

    this._cashFlowService
      .getMonthlyReleases(filters)
      .then((response) => {
        this.releases = response;

        this.totals = {
          expenses: 0,
          revenues: 0,
          balance: 0,
        };

        response.forEach((item) => {
          if (item.type === 'R') this.totals.revenues += item.amount;
          else if (item.type === 'E') this.totals.expenses += item.amount;
        });

        this.totals.balance = this.totals.revenues - this.totals.expenses;
      })
      .catch(() => {
        this.utilsService.showSimpleMessage(
          this.language === 'pt-br'
            ? 'Erro ao obter os lançamentos'
            : 'Error getting the releases'
        );
      })
      .finally(() => {
        this.searching = false;
      });
  }

  getAccounts() {
    this._accountService.getByUser().then((response) => {
      this.accounts = this.utilsService.filterList(response, 'active', true);
    });
  }

  getCategories() {
    this._categoryService
      .getByUser(this._loginService.getLoggedUserId)
      .then((response) => {
        this.categories = response;
      });
  }

  getMonthName(index: number): string {
    const tempDate = new Date(this.selectedYear, index, 15);
    return tempDate.toLocaleString(this.language, { month: 'long' });
  }

  selectMonth(direction: 'before' | 'next'): void {
    if (direction === 'before') {
      this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
    } else {
      this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
    }

    this.selectedDate.setDate(15);
    this.selectedMonth = this.selectedDate.getMonth();
    this.selectedYear = this.selectedDate.getFullYear();

    this.getReleases();
  }

  openDetails(cashFlow: MonthlyCashFlow) {
    lastValueFrom(
      this._bottomSheet
        .open(ReleaseDetailsComponent, {
          data: {
            cashFlow: cashFlow,
          },
          panelClass: 'release-details',
        })
        .afterDismissed()
    ).then((response) => {
      if (!response) return;

      if (response === 'edit') this.editRelease(cashFlow);
      else if (response === 'delete') this.getReleases();
    });
  }

  addRelease() {
    lastValueFrom(
      this._matDialog
        .open(NewRealeseCashFlowDialogComponent, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
            editing: false,
          },
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.getReleases();
    });
  }

  editRelease(release: MonthlyCashFlow) {
    lastValueFrom(
      this._matDialog
        .open(NewRealeseCashFlowDialogComponent, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
            editing: true,
            release: release,
          },
          panelClass: 'new-release-cash-flow-dialog',
          autoFocus: false,
        })
        .afterClosed()
    ).then((response) => {
      if (!response) return;

      this.getReleases();
    });
  }
}
