import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LinkedInAccount, ApiResponse, PageResponse } from '../../core/models';

@Component({
  selector: 'app-linkedin-accounts',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatChipsModule, MatTableModule,
    StatusBadgeComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>LinkedIn Accounts</h1>
          <p class="subtitle">Manage your connected LinkedIn accounts</p>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-center">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (error()) {
        <div class="error-banner">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error() }}</span>
        </div>
      } @else if (accounts().length === 0) {
        <div class="empty-state">
          <mat-icon>manage_accounts</mat-icon>
          <h2>No LinkedIn accounts connected</h2>
          <p>Connect a LinkedIn account to start running outreach campaigns.</p>
        </div>
      } @else {
        <div class="accounts-grid">
          @for (account of accounts(); track account.id) {
            <div class="account-card">
              <div class="card-header">
                @if (account.profilePictureUrl) {
                  <img [src]="account.profilePictureUrl" class="avatar" alt="Profile picture">
                } @else {
                  <div class="avatar-placeholder">
                    <mat-icon>person</mat-icon>
                  </div>
                }
                <div class="account-info">
                  <p class="account-name">{{ account.fullName || account.linkedinEmail }}</p>
                  @if (account.headline) {
                    <p class="account-headline">{{ account.headline }}</p>
                  }
                  <p class="account-email">{{ account.linkedinEmail }}</p>
                </div>
                <app-status-badge [status]="account.status"></app-status-badge>
              </div>

              <div class="limits-row">
                <div class="limit-item">
                  <span class="limit-value">{{ account.connectionsSentToday }} / {{ account.dailyConnectionLimit }}</span>
                  <span class="limit-label">Connections today</span>
                </div>
                <div class="limit-item">
                  <span class="limit-value">{{ account.messagesSentToday }} / {{ account.dailyMessageLimit }}</span>
                  <span class="limit-label">Messages today</span>
                </div>
              </div>

              @if (account.lastSyncedAt) {
                <p class="last-sync">Last synced {{ account.lastSyncedAt | date:'medium' }}</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    .loading-center { display: flex; justify-content: center; padding: 60px 0; }
    .error-banner { display: flex; align-items: center; gap: 8px; background: #fee2e2; color: #991b1b; padding: 12px 16px; border-radius: 8px; }
    .empty-state { text-align: center; padding: 80px 24px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 56px; height: 56px; width: 56px; display: block; margin: 0 auto 16px; }
    .empty-state h2 { font-size: 18px; font-weight: 600; color: #475569; margin: 0 0 8px; }
    .empty-state p { font-size: 14px; margin: 0 0 24px; }
    .accounts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .account-card { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 20px; }
    .card-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
    .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
    .avatar-placeholder { width: 44px; height: 44px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .avatar-placeholder mat-icon { color: #94a3b8; }
    .account-info { flex: 1; min-width: 0; }
    .account-name { font-weight: 600; color: #0f172a; font-size: 14px; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .account-headline { font-size: 12px; color: #64748b; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .account-email { font-size: 12px; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .limits-row { display: flex; gap: 16px; background: #f8fafc; border-radius: 8px; padding: 12px 16px; }
    .limit-item { display: flex; flex-direction: column; }
    .limit-value { font-size: 16px; font-weight: 700; color: #0f172a; }
    .limit-label { font-size: 11px; color: #64748b; margin-top: 2px; }
    .last-sync { font-size: 11px; color: #94a3b8; margin: 10px 0 0; }
  `]
})
export class LinkedInAccountsComponent implements OnInit {
  private http = inject(HttpClient);

  accounts = signal<LinkedInAccount[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<ApiResponse<PageResponse<LinkedInAccount>>>('/api/v1/linkedin-accounts?size=50').subscribe({
      next: res => {
        this.accounts.set(res.data.content);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load LinkedIn accounts');
        this.loading.set(false);
      }
    });
  }
}
