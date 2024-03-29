import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import {
  MonthlyBalance,
  MonthlyFlow,
  MonthlyRelease,
} from '../../../interfaces/cash-flow';
import { CashFlowService } from '../../../services/cash-flow.service';
import { CustomCurrencyPipe } from '../../../utils/customCurrencyPipe';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AccountBasicList } from '../../../interfaces/account';
import { ReleaseFormDialogComponent } from '../../dialogs/release-form-dialog/release-form-dialog.component';
import { CardBasicList } from '../../../interfaces/credit-card';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Category } from '../../../interfaces/category';
import { UserConfigsService } from '../../../services/user-configs.service';
import { ReleasesListComponent } from './components/releases-list/releases-list.component';
import { ReleasesMonthPipe } from '../../../utils/releases-month.pipe';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    CustomCurrencyPipe,
    MatBottomSheetModule,
    TranslateModule,
    MatButtonToggleModule,
    ReleasesListComponent,
    ReleasesMonthPipe,
  ],
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowComponent implements OnInit, OnDestroy {
  public utilsService = inject(UtilsService);
  private _matDialog = inject(MatDialog);
  private _cashFlowService = inject(CashFlowService);
  private _userConfigsService = inject(UserConfigsService);

  private readonly _unsubscribeAll: Subject<void> = new Subject();

  public readonly currency = this.utilsService.getUserConfigs.currency;
  private readonly currentDate: Date = new Date();

  monthlyValues = signal<MonthlyFlow>({
    releases: [],
    expectedBalance: 0,
  });

  searching: WritableSignal<boolean> = signal(false);
  selectedDate: Date = new Date(this.currentDate.setDate(15));

  accounts: AccountBasicList[] = [];
  categories: Category[] = [];
  creditCards: CardBasicList[] = [];

  viewModeCtrl: FormControl = new FormControl<string>(
    this.utilsService.getUserConfigs.releasesViewMode
  );

  totals = computed(() => {
    return this.calculateValues(this.monthlyValues());
  });

  ngOnInit(): void {
    this.getValues();

    const savedMonth = this.utilsService.getItemLocalStorage(
      'selectedMonthCashFlow'
    );

    if (savedMonth) {
      this.selectedDate = new Date(savedMonth);
    } else {
      this.utilsService.setItemLocalStorage(
        'selectedMonthCashFlow',
        this.selectedDate.toString()
      );
    }

    this.getReleases();

    this.viewModeCtrl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.getReleases();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.unsubscribe();

    const configs = this.utilsService.getUserConfigs;
    configs.releasesViewMode = this.viewModeCtrl.value;
    this._userConfigsService.save(configs);

    this.utilsService.setItemLocalStorage(
      'selectedMonthCashFlow',
      this.selectedDate.toString()
    );
  }

  getReleases() {
    this.searching.set(true);

    this._cashFlowService
      .getMonthlyFlow(this.selectedDate, this.viewModeCtrl.value)
      .then((response) => {
        this.monthlyValues.set(response);
      })
      .catch(() => {
        this.utilsService.showMessage('cash-flow.error-getting-releases');
      })
      .finally(() => {
        this.searching.set(false);
      });
  }

  getValues() {
    this._cashFlowService.getValues().then((response) => {
      this.accounts = response.accountsList;
      this.categories = response.categoriesList;
      this.creditCards = response.creditCardsList;
    });
  }

  changeMonth(direction: 'before' | 'next'): void {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(
        direction === 'before'
          ? this.selectedDate.getMonth() - 1
          : this.selectedDate.getMonth() + 1
      )
    );
    this.selectedDate.setDate(15);

    this.getReleases();
  }

  addRelease(releaseType: 'E' | 'R' | 'T') {
    lastValueFrom(
      this._matDialog
        .open(ReleaseFormDialogComponent, {
          data: {
            accounts: this.accounts,
            categories: this.categories,
            creditCards: this.creditCards,
            editing: false,
            releaseType: releaseType,
            selectedDate: this.selectedDate,
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

  calculateValues(monthlyFlow: MonthlyFlow) {
    const doneReleases = this.utilsService.filterList(
      monthlyFlow.releases,
      'done',
      true
    );

    const revenues =
      this.utilsService
        .filterList(doneReleases, 'type', 'R')
        .reduce((count, item) => count + item.amount, 0) || 0;

    let expensesList = this.utilsService.filterList(doneReleases, 'type', 'E');

    expensesList.concat(
      this.utilsService.filterList(doneReleases, 'type', 'I')
    );

    const expenses =
      expensesList.reduce((count, item) => count + item.amount, 0) || 0;

    return {
      revenues,
      expenses,
      balance: revenues - expenses,
      generalBalance: this.accounts.reduce(
        (count, item) => count + item.balance,
        0
      ),
    };
  }
}
