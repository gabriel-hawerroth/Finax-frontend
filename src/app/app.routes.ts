import { Routes } from '@angular/router';
import { BasicTierGuard } from './core/guards/basic-tier.guard';
import { FreeTierGuard } from './core/guards/free-tier.guard';
import { UnauthenticatedUserGuard } from './core/guards/unauthenticated-user.guard';
import { BankAccountsFormPage } from './main/features/bank-accounts/views/form/bank-accounts-form.component';
import { MyBankAccountsPage } from './main/features/bank-accounts/views/principal/bank-accounts.component';
import { CashFlowPage } from './main/features/cash-flow/views/principal/cash-flow.component';
import { CategoriesPage } from './main/features/categories/views/principal/categories.component';
import { CreditCardInvoicePage } from './main/features/credit-card-invoice/views/principal/credit-card-invoice.component';
import { CreditCardsFormPage } from './main/features/credit-card/views/form/credit-cards-form.component';
import { CreditCardsPage } from './main/features/credit-card/views/principal/credit-cards.component';
import { HomePage } from './main/features/home/views/principal/home.component';
import { MyProfilePage } from './main/features/my-profile/views/principal/my-profile.component';
import { UserSettingsPage } from './main/features/user-settings/views/principal/user-settings.component';
import { ChangePasswordPage } from './main/public/views/change-password/change-password.component';
import { CreateAccountPage } from './main/public/views/create-account/create-account.component';
import { ForgotPasswordPage } from './main/public/views/forgot-password/forgot-password.component';
import { LoginPage } from './main/public/views/login/login.component';
import { PublicPage } from './main/public/views/principal/public.component';
import { UserActivationPage } from './main/public/views/user-activation/user-activation.component';
import { SystemErrorWarningPage } from './shared/components/system-error-warning/system-error-warning.component';

export const routes: Routes = [
  { path: '', component: PublicPage },
  { path: 'fora-do-ar', component: SystemErrorWarningPage },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'nova-conta',
    component: CreateAccountPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'ativacao-da-conta',
    component: UserActivationPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'esqueci-minha-senha',
    component: ForgotPasswordPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'recuperacao-da-senha/:userId',
    component: ChangePasswordPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'fluxo-de-caixa',
    component: CashFlowPage,
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
    component: MyBankAccountsPage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'contas-de-banco/:id',
    component: BankAccountsFormPage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'cartoes-de-credito',
    component: CreditCardsPage,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/:id',
    component: CreditCardsFormPage,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/fatura/:id',
    component: CreditCardInvoicePage,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'categorias',
    component: CategoriesPage,
    canActivate: [FreeTierGuard],
  },
  // {
  //   path: 'calculadora-de-juros',
  //   component: InterestCalculatorComponent,
  //   canActivate: [BasicTierGuard],
  // },
  {
    path: 'meu-perfil',
    component: MyProfilePage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'configuracoes',
    component: UserSettingsPage,
    canActivate: [FreeTierGuard],
  },
];
