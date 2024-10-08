import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom } from 'rxjs';
import { Account } from '../../../../../core/entities/account/account';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { ButtonsComponent } from '../../../../../shared/components/buttons/buttons.component';
import { SelectIconDialog } from '../../../../../shared/components/select-icon-dialog/select-icon-dialog.component';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';
import { BackButtonDirective } from '../../../../../shared/directives/back-button.directive';

@Component({
  selector: 'app-accounts-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxCurrencyDirective,
    NgOptimizedImage,
    ButtonsComponent,
    TranslateModule,
    BackButtonDirective,
  ],
  templateUrl: './accounts-form.component.html',
  styleUrl: './accounts-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountsFormPage implements OnInit {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  readonly currency = this.utils.getUserConfigs.currency;

  accountId: number | null =
    +this._activatedRoute.snapshot.paramMap.get('id')! || null;

  accountForm!: FormGroup;

  saving = signal(false);

  constructor(
    public readonly utils: UtilsService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _accountService: AccountService,
    private readonly _location: Location
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.accountId) {
      this._accountService
        .getById(this.accountId)
        .then((response) => this.accountForm.patchValue(response))
        .catch(() => this._location.back());
    }
  }

  private buildForm() {
    this.accountForm = this._fb.group({
      id: null,
      userId: null,
      name: ['', Validators.required],
      type: '',
      code: null,
      balance: [0, Validators.required],
      accountNumber: '',
      agency: null,
      investments: false,
      addOverallBalance: true,
      active: true,
      archived: false,
      image: '',
    });
  }

  public save() {
    this.saving.set(true);
    this.accountForm.markAsPristine();

    this.getSaveRequest(this.accountForm.getRawValue())
      .then(() => {
        this.utils.showMessage('my-accounts.saved-successfully');
        this._router.navigateByUrl('contas');
      })
      .catch(() => this.utils.showMessage('my-accounts.error-saving-account'))
      .finally(() => this.saving.set(false));
  }

  private getSaveRequest(data: Account) {
    if (data.id) return this._accountService.edit(data);
    else return this._accountService.createNew(data);
  }

  public selectIcon() {
    lastValueFrom(this._dialog.open(SelectIconDialog).afterClosed()).then(
      (value) => {
        if (!value) return;

        this.accountForm.get('image')!.setValue(value);
        this.accountForm.markAsDirty();
        this._changeDetectorRef.detectChanges();
      }
    );
  }
}
