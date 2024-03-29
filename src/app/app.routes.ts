import { Routes } from '@angular/router';
import { PublicComponent } from './main/pages/public/public.component';
import { UnauthenticatedUserGuard } from './services/guards/unauthenticated-user.guard';
import { CreateAccountComponent } from './main/pages/public/components/create-account/create-account.component';
import { ChangePasswordComponent } from './main/pages/public/components/change-password/change-password.component';
import { LoginComponent } from './main/pages/public/components/login/login.component';
import { ForgotPasswordComponent } from './main/pages/public/components/forgot-password/forgot-password.component';
import { UserActivationComponent } from './main/pages/public/components/user-activation/user-activation.component';
import { HomeComponent } from './main/pages/home/home.component';
import { FreeTierGuard } from './services/guards/free-tier.guard';
import { SettingsComponent } from './main/pages/settings/settings.component';
import { MyProfileComponent } from './main/pages/my-profile/my-profile.component';
import { MyBankAccountsComponent } from './main/pages/my-bank-accounts/my-bank-accounts.component';
import { BankAccountsFormComponent } from './main/pages/my-bank-accounts/components/bank-accounts-form/bank-accounts-form.component';
import { CashFlowComponent } from './main/pages/cash-flow/cash-flow.component';
// import { InvestmentsComponent } from './main/pages/investments/investments.component';
// import { MarketIndicatorsComponent } from './main/pages/market-indicators/market-indicators.component';
// import { NoticesBrazilComponent } from './main/pages/notices-brazil/notices-brazil.component';
// import { NoticesCriptoComponent } from './main/pages/notices-cripto/notices-cripto.component';
// import { NoticesInternationalComponent } from './main/pages/notices-international/notices-international.component';
// import { ReportCashFlowComponent } from './main/pages/report-cash-flow/report-cash-flow.component';
// import { ReportInvestmentsComponent } from './main/pages/report-investments/report-investments.component';
// import { SpendingGoalsComponent } from './main/pages/spending-goals/spending-goals.component';
import { BasicTierGuard } from './services/guards/basic-tier.guard';
// import { PremiumTierGuard } from './services/guards/premium-tier.guard';
// import { InterestCalculatorComponent } from './main/pages/interest-calculator/interest-calculator.component';
import { CategorysComponent } from './main/pages/categories/categories.component';
import { CreditCardsComponent } from './main/pages/credit-cards/credit-cards.component';
import { CreditCardsFormComponent } from './main/pages/credit-cards/components/credit-cards-form/credit-cards-form.component';
import { CreditCardInvoiceComponent } from './main/pages/credit-cards/components/credit-card-invoice/credit-card-invoice.component';
import { SystemErrorWarningComponent } from './utils/system-error-warning/system-error-warning.component';

export const routes: Routes = [
  { path: '', component: PublicComponent },
  { path: 'fora-do-ar', component: SystemErrorWarningComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'nova-conta',
    component: CreateAccountComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'ativacao-da-conta',
    component: UserActivationComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'esqueci-minha-senha',
    component: ForgotPasswordComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'recuperacao-da-senha/:userId',
    component: ChangePasswordComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'fluxo-de-caixa',
    component: CashFlowComponent,
    canActivate: [FreeTierGuard],
  },
  // {
  //   path: 'investimentos',
  //   component: InvestmentsComponent,
  //   canActivate: [BasicTierGuard],
  // },
  // {
  //   path: 'relatorio/fluxo-de-caixa',
  //   component: ReportCashFlowComponent,
  //   canActivate: [BasicTierGuard],
  // },
  // {
  //   path: 'relatorio/investimentos',
  //   component: ReportInvestmentsComponent,
  //   canActivate: [BasicTierGuard],
  // },
  // {
  //   path: 'indicadores',
  //   component: MarketIndicatorsComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'noticias/b3',
  //   component: NoticesBrazilComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'noticias/internacional',
  //   component: NoticesInternationalComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'noticias/criptos',
  //   component: NoticesCriptoComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'metas-de-gasto',
  //   component: SpendingGoalsComponent,
  //   canActivate: [FreeTierGuard],
  // },
  {
    path: 'contas-de-banco',
    component: MyBankAccountsComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'contas-de-banco/:id',
    component: BankAccountsFormComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'cartoes-de-credito',
    component: CreditCardsComponent,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/:id',
    component: CreditCardsFormComponent,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/fatura/:id',
    component: CreditCardInvoiceComponent,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'categorias',
    component: CategorysComponent,
    canActivate: [FreeTierGuard],
  },
  // {
  //   path: 'calculadora-de-juros',
  //   component: InterestCalculatorComponent,
  //   canActivate: [BasicTierGuard],
  // },
  {
    path: 'meu-perfil',
    component: MyProfileComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'configuracoes',
    component: SettingsComponent,
    canActivate: [FreeTierGuard],
  },
];
