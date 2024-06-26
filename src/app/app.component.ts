import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './core/entities/auth/login.service';
import { MobilePage } from './main/features/mobile-page/views/principal/mobile-page.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { UtilsService } from './shared/utils/utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, MobilePage],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    public readonly loginService: LoginService,
    public readonly location: Location,
    private readonly _utils: UtilsService
  ) {
    this._utils.removeItemLocalStorage('savedUserConfigsFinax');

    this._utils.setDefaultLanguage();
  }
}
