import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/auth/auth.service';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard', exact: true },
  { icon: 'people', label: 'Leads', path: '/dashboard/leads', exact: false },
  { icon: 'campaign', label: 'Campaigns', path: '/dashboard/campaigns', exact: false },
  { icon: 'manage_accounts', label: 'LinkedIn Accounts', path: '/dashboard/linkedin-accounts', exact: false },
  { icon: 'settings', label: 'Settings', path: '/dashboard/settings', exact: false },
];

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="shell">
      <nav class="sidebar">
        <div class="sidebar-logo">
          <mat-icon>rocket_launch</mat-icon>
          <span>Prospects.ai</span>
        </div>

        <div class="nav-items">
          @for (item of navItems; track item.path) {
            <a class="nav-item" [routerLink]="item.path"
               routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: item.exact }"
               [matTooltip]="item.label" matTooltipPosition="right">
              <mat-icon>{{ item.icon }}</mat-icon>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </div>

        <div class="sidebar-footer">
          @if (auth.currentUser()) {
            <div class="user-info">
              <div class="avatar">{{ auth.currentUser()!.firstName[0] }}{{ auth.currentUser()!.lastName[0] }}</div>
              <div class="user-meta">
                <span class="user-name">{{ auth.currentUser()!.firstName }} {{ auth.currentUser()!.lastName }}</span>
                <span class="user-email">{{ auth.currentUser()!.email }}</span>
              </div>
            </div>
          }
          <button mat-icon-button (click)="auth.logout()" matTooltip="Sign out" matTooltipPosition="right" class="logout-btn">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </nav>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell { display: flex; height: 100vh; overflow: hidden; }
    .sidebar { width: 220px; flex-shrink: 0; background: #1e293b; display: flex; flex-direction: column; padding: 0; overflow: hidden; }
    .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 20px 20px 16px; font-size: 16px; font-weight: 700; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .sidebar-logo mat-icon { color: #818cf8; }
    .nav-items { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s, color 0.15s; }
    .nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
    .nav-item.active { background: rgba(129,140,248,0.15); color: #818cf8; }
    .nav-item mat-icon { font-size: 20px; height: 20px; width: 20px; flex-shrink: 0; }
    .sidebar-footer { padding: 12px 8px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 8px; }
    .user-info { display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: #4f46e5; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .user-meta { display: flex; flex-direction: column; overflow: hidden; }
    .user-name { font-size: 13px; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-email { font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .logout-btn { color: #64748b; flex-shrink: 0; }
    .logout-btn:hover { color: #94a3b8; }
    .content { flex: 1; overflow-y: auto; background: #f8fafc; }
  `]
})
export class DashboardShellComponent {
  auth = inject(AuthService);
  navItems = NAV_ITEMS;
}
