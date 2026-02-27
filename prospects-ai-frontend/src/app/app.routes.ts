import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing-page.component')
      .then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/shell/dashboard-shell.component')
      .then(m => m.DashboardShellComponent),
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/home/dashboard-home.component').then(m => m.DashboardHomeComponent) },
      { path: 'linkedin-accounts', loadComponent: () => import('./features/linkedin-accounts/linkedin-accounts.component').then(m => m.LinkedInAccountsComponent) },
      { path: 'leads', loadComponent: () => import('./features/leads/leads.component').then(m => m.LeadsComponent) },
      { path: 'campaigns', loadComponent: () => import('./features/campaigns/list/campaigns-list.component').then(m => m.CampaignsListComponent) },
      { path: 'campaigns/create', loadComponent: () => import('./features/campaigns/create/create-campaign.component').then(m => m.CreateCampaignComponent) },
      { path: 'campaigns/:id', loadComponent: () => import('./features/campaigns/detail/campaign-detail.component').then(m => m.CampaignDetailComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
