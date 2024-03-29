import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../utils/utils.service';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnDestroy {
  public loginService = inject(LoginService);
  public utilsService = inject(UtilsService);
  private _userService = inject(UserService);

  private _unsubscribeAll: Subject<void> = new Subject();

  userAccess: string = this.utilsService.getLoggedUser?.access || '';

  reportsUl: boolean = true;
  noticesUl: boolean = true;
  moreUl: boolean = true;
  userActionsUl: boolean = true;

  darkThemeEnabled = signal(false);

  ngOnInit(): void {
    this.subscribeUserConfigs();
    this.getUserImage();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.unsubscribe();
  }

  subscribeUserConfigs() {
    this.utilsService
      .subscribeUserConfigs()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.darkThemeEnabled.set(value.theme === 'dark');
      });
  }

  getUserImage() {
    this._userService.getUserImage().then((response: Blob) => {
      if (response.size !== 0) {
        const reader = new FileReader();
        reader.onload = () => {
          this.utilsService.userImage.next(reader.result);
        };
        reader.readAsDataURL(response);
      }
    });
  }

  logout() {
    this.loginService.logout(false);
  }
}
