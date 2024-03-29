import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ButtonsComponent } from '../../../../../utils/buttons/buttons.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatSelectModule } from '@angular/material/select';
import { AccountService } from '../../../../../services/account.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { lastValueFrom } from 'rxjs';
import { SelectIconDialogComponent } from '../../../../dialogs/select-icon-dialog/select-icon-dialog.component';
import { CreditCardService } from '../../../../../services/credit-card.service';
import { TranslateModule } from '@ngx-translate/core';
import { AccountBasicList } from '../../../../../interfaces/account';

@Component({
  selector: 'app-credit-cards-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgxCurrencyDirective,
    MatSelectModule,
    NgOptimizedImage,
    MatCheckboxModule,
    TranslateModule,
  ],
  templateUrl: './credit-cards-form.component.html',
  styleUrl: './credit-cards-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardsFormComponent implements OnInit {
  public utilsService = inject(UtilsService);
  public location = inject(Location);
  private _creditCardService = inject(CreditCardService);
  private _activatedRoute = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _accountService = inject(AccountService);

  currency = this.utilsService.getUserConfigs.currency;

  cardId: number = +this._activatedRoute.snapshot.paramMap.get('id')!;

  cardForm!: FormGroup;

  saving: boolean = false;

  accounsList: AccountBasicList[] = [];
  selectedAccount: AccountBasicList | null = null;

  daysOfMonth: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  selectedIcon: WritableSignal<string | null> = signal(null);
  changedIcon: boolean = false;

  ngOnInit(): void {
    this.buildForm();

    if (this.cardId) {
      this._creditCardService.getById(this.cardId).then((response) => {
        this.cardForm.patchValue(response);

        if (response.image) {
          this.selectedIcon.set(response.image);
        }
      });
    }

    this._accountService.getBasicList().then((response) => {
      this.accounsList = response;

      if (this.cardId && !this.selectedAccount) {
        const standardPaymentAccount =
          this.cardForm.value.standard_payment_account_id;

        this.cardForm
          .get('standard_payment_account_id')!
          .setValue(standardPaymentAccount);
        this.paymentAccountChanges(standardPaymentAccount);
      }
    });
  }

  buildForm() {
    this.cardForm = this._fb.group({
      id: null,
      user_id: this.utilsService.getLoggedUser!.id,
      name: ['', Validators.required],
      card_limit: [0, Validators.required],
      close_day: [1, Validators.required],
      expires_day: [1, Validators.required],
      image: null,
      standard_payment_account_id: [null, Validators.required],
      active: true,
    });

    this.cardForm.markAllAsTouched();
  }

  save() {
    if (this.cardForm.value.card_limit === 0) {
      this.utilsService.showMessage(
        'credit-cards.limit-must-be-greater-than-zero'
      );
      return;
    }

    this.saving = true;

    this.cardForm.markAsPristine();
    const data = this.cardForm.value;

    this._creditCardService
      .save(data)
      .then(() => {
        this.utilsService.showMessage('credit-cards.saved-successfully');
        this._router.navigate(['cartoes-de-credito']);
      })
      .catch(() => {
        this.utilsService.showMessage('credit-cards.error-saving-card');
      })
      .finally(() => {
        this.saving = false;
      });
  }

  selectIcon() {
    lastValueFrom(
      this._dialog.open(SelectIconDialogComponent).afterClosed()
    ).then((value) => {
      if (!value) return;

      this.selectedIcon.set(value);
      this.cardForm.get('image')!.setValue(value);
      this.cardForm.markAsDirty();
    });
  }

  paymentAccountChanges(value: number) {
    console.log('accountsList:', this.accounsList);
    this.selectedAccount = this.accounsList.find((item) => item.id === value)!;
  }
}
